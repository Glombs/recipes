$(function () {
    function supports_html5_storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    function format(data) {
        function getIcon(ext) {
            switch (ext) {
                case ".txt":
                    return "fa-file-text-o";
                case ".odt":
                case ".doc":
                case ".docx":
                    return "fa-file-word-o";
                case ".jpg":
                case ".jpeg":
                case ".png":
                case ".gif":
                    return "fa-file-image-o";
                case ".htm":
                case ".html":
                    return "fa-file-code-o";
                default:
                    return "fa-file-o";
            }
        }

        function formatName(name) {

            name =
                //Remove file extension
                name.replace(/\.[^/.]+$/, "")

                //Convert Pascal/camel case
                // add space before capital letters
                .replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function (str) { return str.toUpperCase(); });
            return name;
        }

        $.each(data, function (i, e) {
            if (e.path.toLowerCase() != "index.html" && e.path.toLowerCase() != "resources") {
                var template = $($("#recipeItemTemplate").html());

                var ext = e.name.match(/\.[^/.]+$/).toString().toLowerCase();
                template.find(".recipes__item__link").attr("href", e.path).text(formatName(e.name)).data("ext", ext);
                template.find(".recipes__item__icon").addClass(getIcon(e.name));

                $(".recipes").append(template);
            }
        });
    }

    var store = supports_html5_storage();
    var data;
    var valid = false;
    if (store && localStorage["recipes"]) {
        data = JSON.parse(localStorage["recipes"]);
        data.aquired = moment(data.aquired, "YYYYMMDDHHmm");
        valid = moment().diff(data.aquired.add(1, "hours")) < 0;
    }
    if (valid) {
        format(data.data);
    } else {
        $.ajax({
            url: "https://api.github.com/repos/glombs/recipes/contents",
            success: function (data) {
                format(data);
                if (store) {
                    localStorage["recipes"] = JSON.stringify({ aquired: moment().format("YYYYMMDDHHmm"), data: data });
                }
            }
        });
    }
});