$(function () {
    $(".navbar-toggler").blur(function () {
        var screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            $(".collapse").collapse('hide');
        }
    });
});

(function (global) {
    var dc = {}

    var homeUrl = "snippets/home-snippet.html";
    var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
    var menuCategoriesTitleHtml = "snippets/menu-categories-title.html";
    var categoryTileHtml = "snippets/category-tile.html";
    var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";
    var menuItemTitleUrl = "snippets/menu-item-title.html";
    var menuItemTileHtml = "snippets/menu-item-tile.html";


    var insertHtml = function (selector, html) {
        document.querySelector(selector).innerHTML = html;
    };

    var insertProperty = function (text, propName, value) {
        return text.replace(new RegExp("{{" + propName + "}}", "g"), value);
    }

    var showLoading = function (selector) {
        var html = "<div class='text-center'><image src='images/ajax-loader.gif' height='50' width='50'></image></div>";
        insertHtml(selector, html)
    };

    var switchMenuActive = function () {
        var className = document.querySelector(".active").className;
        className = className.replace(new RegExp("active ", "g"), "");
        document.querySelector(".active").className = className;
        className = document.querySelector("#NavMenuBtn").className;
        if (className.indexOf("active") == -1) {
            document.querySelector("#NavMenuBtn").className += " active";
        }
    };  

    document.addEventListener("DOMContentLoaded", function (event) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(homeUrl, function (responseText) {
            insertHtml("#main-content", responseText);
        }, false);
    });

    dc.loadMenuCategories = function () {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl, function (categories) {
            loadMenuCategoriesHtml(categories);
        });
    };

    dc.loadMenuItem = function (categoryShort) {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort, function (category) {
            loadMenuItemHtml(category);
        });
    };

    function loadMenuCategoriesHtml (categories) {
        $ajaxUtils.sendGetRequest(menuCategoriesTitleHtml, function (titleHtml) {
            $ajaxUtils.sendGetRequest(categoryTileHtml, function (tileHtml) {
                switchMenuActive();
                var viewHtml = buildMenuCategoriesHtml(titleHtml, tileHtml, categories);
                insertHtml("#main-content", viewHtml);
            }, false);
        }, false);
    };

    function loadMenuItemHtml (category) {
        $ajaxUtils.sendGetRequest(menuItemTitleUrl, function (title) {
            $ajaxUtils.sendGetRequest(menuItemTileHtml, function (tile) {
                var viewHtml = buildMenuItemHtml(category, title, tile);
                switchMenuActive();
                insertHtml("#main-content", viewHtml);
            }, false);
        }, false);
    }

    function buildMenuCategoriesHtml (titleHtml, tileHtml, categories) {
        var viewHtml = titleHtml;
        viewHtml += "<div class='row flex-wrap'>";

        for (var i=0;i<categories.length; i++) {
            var html = tileHtml;
            html = insertProperty(html, "name", categories[i].name);
            html = insertProperty(html, "short-name", categories[i].short_name);
            viewHtml += html;
        }

        viewHtml += "</div>";

        return viewHtml;
    };

    function buildMenuItemHtml (category, title, tile) {

        title = insertProperty(title, "name", category.category.name);
        title = insertProperty(title, "special_instructions", category.category.special_instructions);

        var viewHtml = title;
        viewHtml += "<div class='row'>";

        var items = category.menu_items;
        for (var i=0;i<items.length;i++) {

            var html = tile;
            html = insertProperty(html, "category-name", category.category.short_name);
            html = insertProperty(html, "short_name", items[i].short_name);
            html = insertProperty(html, "name", items[i].name);
            html = insertProperty(html, "description", items[i].description);
            html = insertPortion(html, "portion_name_small", items[i].small_portion_name);
            html = insertPortion(html, "portion_name_large", items[i].large_portion_name);
            html = insertPrice(html, "price_small", items[i].price_small);
            html = insertPrice(html, "price_large", items[i].price_large);
            viewHtml += html;

            if (i % 2 == 1) {
                viewHtml += "<div class='clearfix visible-lg-block visible-md-block'></div>";
            }
        }

        viewHtml += "</div>";

        return viewHtml;
    };

    function insertPortion(text, propName, value) {
        if (!value) {
            return insertProperty(text, propName, "");
        }
        return insertProperty(text, propName, "(" + value + ")");
    }

    function insertPrice(text, propName, value) {
        if (!value) {
            return insertProperty(text, propName, "");
        }
        return insertProperty(text, propName, "$" + value.toFixed(2));
    }

    global.$dc = dc;

})(window);

