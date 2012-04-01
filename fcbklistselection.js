/* 
fcbkListSelection 1.10 M1
Jquery version required: 1.2.x, 1.3.x, 1.4.x                      

Changelog:
- 1.1 M1 : height/expand/showtabs/allbtn/selectall options added, converted code to work as a more 

universal plugin.
- 1.1: added preselected items
- 1.0: project started

Original by: emposha <admin@emposha.com>
M1 Update by: an0nz
Copyright: Emposha.com <http://www.emposha.com/> Distributed under MIT - Keep this message!

OPTIONS : Default
width: 450,       - width of ul
height: 150,      - height of ul
expand: true,     - auto expanding ul height to height specified above
rowHeight: 15,    - height of rows
rowItems: 3,      - number of items per row
showTabs: true,   - set to true to hide tabs
allBtnTxt: null,  - if specified a button to select all elements will appear with the text entered eg: 

'All'
selectAll: false, - select all 
delimiter: ','    - the string delimiter used for GetSelected() and SetSelected(vals)

USAGE
  
// Initialize fcbkListSelection
$('#fcbkList').fcbkListSelection({
showTabs: false,
allBtnTxt: 'ALL',
selectAll: true,
delimiter: ' '
});

$('#fcbkList').fcbkListSelection('GetSelected');          - Returns a delimited string of selected 

hidden field values (Delimiter specified in options)
$('#fcbkList').fcbkListSelection('SetSelected', vals)     - Selects list items based on hidden field 

values. input: delimited values list (Delimiter specified in options)


GLOBAL SETTINGS : you can adjust global settings by using the following layout, this works for all 

options
$.fn.fcbkListSelection.settings.rowHeight = 15;
$.fn.fcbkListSelection.settings.rowItems = 2;

NB: Global setting adjustments must be done before any calls to fcbkListSelection and can be overridden 

by passing options during the init phase
*/

(function ($) {
    $.fn.fcbkListSelection = function (method) {

        // Private Common Functions
        var hiddenCheck = function (elem, obj) {
            switch (curTab()) {
                case "all":
                    elem.children("li").show();
                    break;

                case "selected":
                    elem.children("li:not([addedid])").hide();
                    elem.children("li[addedid]").show();
                    break;

                case "unselected":
                    elem.children("li[addedid]").hide();
                    elem.children("li:not([addedid])").show();
                    break;
            }
        }

        var addAll = function (elem, allbtn) {
            if (allbtn) {
                elem.prepend('<li title="' + allbtn + '"><strong>' + allbtn + '</strong></li>');
            }
        }

        //add to selected items function
        var addToSelected = function (elem, obj) {
            if (obj.hasClass("itemselected")) {
                $("#view_selected_count").text(parseInt($("#view_selected_count").text(), 10) - 1);
                obj.parents("li").removeAttr("addedid");
                removeValue(elem, obj);
            }
            else {
                $("#view_selected_count").text(parseInt($("#view_selected_count").text(), 10) + 1);
                obj.parents("li").attr("addedid", "true");
                addValue(elem, obj);
            }
            hiddenCheck(elem, obj);
        }

        var addValue = function (elem, obj, value) {
            //create input
            var inputid = elem.attr('id') + "_values";
            if ($("#" + inputid).length == 0) {
                var input = document.createElement('input');
                $(input).attr({
                    'type': 'hidden',
                    'name': inputid,
                    'id': inputid,
                    'value': ""
                });
                elem.after(input);
            }
            else {
                var input = $("#" + inputid);
            }
            var randid = "rand_" + randomId();
            if (!value) {
                value = obj.find("[type=hidden]").val();
                obj.find("[type=hidden]").attr("randid", randid);
            }
            var jsdata = new data(randid, value);
            var stored = jsToString(jsdata, $(input).val());
            $(input).val(stored);
            return input;
        }

        var removeValue = function (elem, obj) {
            var randid = obj.find("[type=hidden]").attr("randid");
            var inputid = elem.attr('id') + "_values";
            if ($("#" + inputid).length != 0) {
                try {
                    eval("json = " + $("#" + inputid).val() + ";");
                    var string = "{";
                    $.each(json, function (i, item) {
                        if (i && item && i != randid) {
                            string += "\"" + i + "\":\"" + item + "\",";
                        }
                    });
                    //remove last ,
                    if (string.length > 2) {
                        string = string.substr(0, (string.length - 1));
                        string += "}"
                    }
                    else {
                        string = "";
                    }
                    $("#" + inputid).val(string);
                }
                catch (e) {
                }
            }
        }

        var toggleAllButton = function (elem, state, allbtn) {
            var all = elem.children("li").eq(0).children(".fcbklist_item");
            if (state) {

                var allselected = true;
                $.each(elem.children("li").children(".fcbklist_item"), function (i, obj) {
                    obj = $(obj);
                    if (!obj.hasClass("itemselected") && allbtn && obj.parents("li[title='" + allbtn + 

"']").length == 0) {
                        allselected = false;
                    }
                });
                if (allselected) {
                    addToSelected(elem, all);
                    all.addClass("itemselected");
                    all.parents("li").addClass("liselected");
                }

            } else if (all.hasClass("itemselected")) {
                addToSelected(elem, all);
                all.removeClass("itemselected");
                all.parents("li").removeClass("liselected");
            }

        }

        var curTab = function () {
            return $(".view_on").attr("id").replace("view_", "");
        }

        var data = function (id, value) {
            try {
                eval("this." + id + " = value;");
            }
            catch (e) {
            }
        }

        var jsToString = function (jsdata, json) {
            var string = "{";
            $.each(jsdata, function (i, item) {
                if (i) {
                    string += "\"" + i + "\":\"" + item + "\",";
                }
            });
            try {
                eval("json = " + json + ";");
                $.each(json, function (i, item) {
                    if (i && item) {
                        string += "\"" + i + "\":\"" + item + "\",";
                    }
                });
            }
            catch (e) {
            }
            //remove last ,
            string = string.substr(0, (string.length - 1));
            string += "}"
            return string;
        }

        var randomId = function () {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var string_length = 32;
            var randomstring = '';
            for (var i = 0; i < string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
            }
            return randomstring;
        }



        // Plugin Methods
        var methods = {
            init: function (options) {
                return this.each(function () {

                    var o = $.extend({}, $.fn.fcbkListSelection.settings, options);

                    //get content of tabs
                    var getContent = function (elem, tab) {
                        switch (tab) {
                            case "all":
                                elem.children("li").show();
                                break;

                            case "selected":
                                elem.children("li:not([addedid])").hide();
                                elem.children("li[addedid]").show();
                                break;

                            case "unselected":
                                elem.children("li[addedid]").hide();
                                elem.children("li:not([addedid])").show();
                                break;
                        }
                    }

                    //bind onmouseover && click event on item
                    var bindEventsOnItems = function (elem) {
                        var count = 0;
                        var selcount = 0;
                        $.each(elem.children("li").children(".fcbklist_item"), function (i, obj) {
                            obj = $(obj);
                            if (o.selectAll) {
                                addToSelected(elem, obj);
                                obj.toggleClass("itemselected");
                                obj.parents("li").toggleClass("liselected");
                            } else if (obj.children("input[alt='checked']").length != 0) {
                                addToSelected(elem, obj);
                                obj.toggleClass("itemselected");
                                obj.parents("li").toggleClass("liselected");
                                selcount++;
                            }
                            if (obj.parents("li[title='" + o.allBtnTxt + "']").length == 0) {
                                count++;
                            }
                            obj.click(function () {
                                if (o.allBtnTxt && obj.parents("li[title='" + o.allBtnTxt + "']").length 

!= 0) {
                                    toggleAllSelected(elem, obj.hasClass("itemselected"), o.allBtnTxt);
                                } else {
                                    addToSelected(elem, obj);
                                    obj.toggleClass("itemselected");
                                    obj.parents("li").toggleClass("liselected");
                                    if (o.allBtnTxt) { toggleAllButton(elem, 

obj.hasClass("itemselected"), o.allBtnTxt); }
                                }
                            });
                            obj.mouseover(function () {
                                obj.addClass("itemover");
                            });
                            obj.mouseout(function () {
                                $(".itemover").removeClass("itemover");
                            });
                        });
                        if (!o.selectAll && o.allBtnTxt && count == selcount) {
                            toggleAllButton(elem, true, o.allBtnTxt);
                        }
                    }

                    var toggleAllSelected = function (elem, state, allbtn) {
                        $.each(elem.children("li").children(".fcbklist_item"), function (i, obj) {
                            obj = $(obj);
                            if (obj.hasClass("itemselected") == state) {
                                addToSelected(elem, obj);
                                obj.toggleClass("itemselected");
                                obj.parents("li").toggleClass("liselected");
                            }
                        });
                    }

                    //bind onclick event on filters
                    var bindEventsOnTabs = function (elem) {
                        $.each($("#selections li"), function (i, obj) {
                            obj = $(obj);
                            obj.click(function () {
                                $(".view_on").removeClass("view_on");
                                obj.addClass("view_on");
                                getContent(elem, obj.attr("id").replace("view_", ""));
                            });
                        });
                    }

                    //create control tabs
                    var createTabs = function (elem, width) {
                        hide = '';
                        if (!o.showTabs) { hide = ' style="display:none;"'; }

                        var html = '<div id="filters" style="width:' + (parseInt(width, 10) + 2) + 

'px;">' +
                    '<ul class="selections"' + hide + ' id="selections"><li id="view_all" 

class="view_on">' +
                    '<a onclick="return false;" href="#">View All</a></li>' +
                    '<li id="view_selected" class=""><a onclick="return false;" href="#">Selected 

(<strong id="view_selected_count">0</strong>)</a></li>' +
                    '<li id="view_unselected" class=""><a onclick="return false;" 

href="#">Unselected</a></li>' +
                    '</ul><div class="clearer"></div></div>';
                        elem.before(html);
                    }

                    //wrap elements with div
                    var wrapElements = function (elem, width, height, expand, elheight, row) {
                        elem.children("li").wrapInner('<div class="fcbklist_item"></div>');
                        $(".fcbklist_item").css("height", elheight + "px");
                        var newwidth = Math.ceil((parseInt(width, 10)) / parseInt(row, 10)) - 11;
                        $(".fcbklist_item").css("width", newwidth + "px");

                        if (!expand) { elem.height(height + 'px'); }

                        if (elem.height() > height) {
                            if (expand) { elem.height(height + 'px'); }
                            newwidth -= Math.ceil((parseInt(13, 10)) / parseInt(row, 10));
                        }
                    }

                    //main
                    var elem = $(this);
                    elem.css("width", o.width + "px");

                    createTabs(elem, o.width);
                    addAll(elem, o.allBtnTxt);
                    wrapElements(elem, o.width, o.height, o.expand, o.rowHeight, o.rowItems);

                    bindEventsOnTabs(elem);
                    bindEventsOnItems(elem, o.allBtnTxt);

                    // Save active settings to element
                    elem.data('fcbkListSelection', o);

                });
            },
            GetSelected: function () {
                var ret = new Array();
                var removed = 0;
                $.each($(this).children('li[addedid=\'true\']'), function (i, obj) {
                    obj = $(obj).find('input[type="hidden"]');
                    if (obj.val()) {
                        ret[i - removed] = obj.val();
                    } else {
                        removed++;
                    }
                });


                var o = $(this).data('fcbkListSelection');
                var sep = $.fn.fcbkListSelection.settings.delimiter;
                if (o) { sep = o.delimiter; }
                return ret.join(sep);
            },
            SetSelected: function (vals) {
                var elem = $(this);
                var o = elem.data('fcbkListSelection');
                var sep = $.fn.fcbkListSelection.settings.delimiter;
                if (o) { sep = o.delimiter; }

                $.each($(this).children('li'), function (i, obj) {
                    obj = $(obj);
                    var hdn = obj.find('input[type="hidden"]')
                    if (hdn.val()) {
                        var arrVals = vals.split(sep);
                        var arLen = arrVals.length;
                        var found = false;
                        for (var i = 0, len = arLen; i < len; ++i) {
                            if (hdn.val() == arrVals[i]) {
                                found = true;
                                var item = obj.children(".fcbklist_item");
                                if (item.hasClass("itemselected") == false) {
                                    addToSelected(elem, item);
                                    item.toggleClass("itemselected");
                                    obj.toggleClass("liselected");
                                }
                            }
                        }
                        if (!found) {
                            var item = obj.children(".fcbklist_item");
                            if (item.hasClass("itemselected") == true) {
                                addToSelected(elem, item);
                                item.toggleClass("itemselected");
                                obj.toggleClass("liselected");
                                if (o) {
                                    if (o.allBtnTxt) { toggleAllButton(elem, 

item.hasClass("itemselected"), o.allBtnTxt); }
                                }
                            }
                        }
                    }
                });
            }
        };

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.fcbkListSelection');
        }

    };

    $.fn.fcbkListSelection.settings = {
        width: 450,
        height: 150,
        expand: true,
        rowHeight: 15,
        rowItems: 3,
        showTabs: true,
        allBtnTxt: null,
        selectAll: false,
        delimiter: ','
    }

})(jQuery);