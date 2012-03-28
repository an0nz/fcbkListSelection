=======================
 fcbkListSelection 1.10 M1
=======================
fcbkListSelection is a fancy item selector, just like the friends selector you can see on Facebook.
It is built with jQuery javascript framework, with wide range of options.
You can check out the Demo `here <http://www.emposha.com/demo/fcbklistselection/>`_.

- supported Jquery versions: 1.2.x - 1.6.x
 
Changelog:

- 1.1 M1 : height/expand/showtabs/allbtn/selectall options added, converted code to work as a more universal plugin.
- 1.1: added preselected items
- 1.0: project started

Coded by: emposha <admin@emposha.com>

M1 Update by: an0nz

Copyright: `Emposha.com <http://www.emposha.com>`_

License: Distributed under MIT license


-----------
HTML Markup
-----------

The html pattern required for this plugin to work is (see index.html):

    <ul id="fcbklist">
        <li>        
            <strong>Manuel Mujica Lainez</strong><br /> 
            <span class="fcbkitem_text">auto complete & pre added values.</span>
            <input type="hidden" name="fcbklist_value[]" value="Manuel Mujica Lainez" />       
        </li>
        <li>        
            <strong>Gustavo Nielsen</strong><br />
            <span class="fcbkitem_text">If you have any comments or requests, please post them and</span>
            <input type="hidden" name="fcbklist_value[]" alt="checked" value="Gustavo Nielsen" />         
        </li> 
        [...]    
    </ul>

Note the alt="checked" on Gustavo Nielsen's hidden field, this will ensure that it is selected by default

----------------
Javascript usage
----------------

In <script> tag, put:

    $(document).ready(function() {
        $('#fcbkList').fcbkListSelection({
              showTabs: false,
              allBtnTxt: 'ALL',
              selectAll: true,
              delimiter: ' '
        });
    });

-------------
Other Details
-------------

Config Options
  - width: 450 (width of ul)
  - height: 150 (height of ul)
  - expand: true/false (auto expanding ul height to height specified above)
  - rowHeight: 15 (height of rows)
  - rowItems: 3 (number of items per row)
  - showTabs: true/false (set to true to hide tabs)
  - allBtnTxt: string/null (if specified a button to select all elements will appear with the text entered eg: 'All')
  - selectAll: false (select all )
  - delimiter: ',' (the string delimiter used for GetSelected() and SetSelected(vals))


Other Functions
  $('#fcbkList').fcbkListSelection('GetSelected');
   - Returns a delimited string of selected hidden field values (Delimiter specified in options)

  $('#fcbkList').fcbkListSelection('SetSelected', vals)
   - Selects list items based on hidden field values. input: delimited values list (Delimiter specified in options)


Global Settings 
  You can adjust global settings by using the following layout, this works for all options
   - $.fn.fcbkListSelection.settings.rowHeight = 15;
   - $.fn.fcbkListSelection.settings.rowItems = 2;

  NB: Global setting adjustments must be done before any calls to fcbkListSelection and can be overridden by passing options during the init phase