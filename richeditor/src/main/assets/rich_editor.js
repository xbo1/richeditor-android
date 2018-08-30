/**
 * Copyright (C) 2017 Wasabeef
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var RE = {};

RE.currentSelection = {
    "startContainer": 0,
    "startOffset": 0,
    "endContainer": 0,
    "endOffset": 0
};

RE.editor = document.getElementById('editor');

// Initializations
RE.callback = function () {
    if (RE.getHtml().length <= 0) {
        document.execCommand('formatBlock', false, '<div>');
    }
    window.location.href = "re-callback://" + encodeURI(RE.getHtml());
}

RE.setHint = function(placeholder) {
    RE.editor.setAttribute("placeholder", placeholder);
}

RE.setHtml = function (contents) {
    RE.editor.innerHTML = decodeURIComponent(contents.replace(/\+/g, '%20'));
}

RE.getHtml = function () {
    return RE.editor.innerHTML;
}

RE.getText = function () {
    return RE.editor.innerText;
}

RE.setBaseTextColor = function (color) {
    RE.editor.style.color = color;
}

RE.setBaseFontSize = function (size) {
    RE.editor.style.fontSize = size;
}

RE.setPadding = function (left, top, right, bottom) {
    RE.editor.style.paddingLeft = left;
    RE.editor.style.paddingTop = top;
    RE.editor.style.paddingRight = right;
    RE.editor.style.paddingBottom = bottom;
}

RE.setBackgroundColor = function (color) {
    document.body.style.backgroundColor = color;
}

RE.setBackgroundImage = function (image) {
    RE.editor.style.backgroundImage = image;
}

RE.setWidth = function (size) {
    RE.editor.style.minWidth = size;
}

RE.setHeight = function (size) {
    RE.editor.style.height = size;
}

RE.setTextAlign = function (align) {
    RE.editor.style.textAlign = align;
}

RE.setVerticalAlign = function (align) {
    RE.editor.style.verticalAlign = align;
}

RE.setPlaceholder = function (placeholder) {
    RE.editor.setAttribute("placeholder", placeholder);
}

RE.setInputEnabled = function (inputEnabled) {
    RE.editor.contentEditable = String(inputEnabled);
}

RE.undo = function () {
    document.execCommand('undo', false, null);
}

RE.redo = function () {
    document.execCommand('redo', false, null);
}

RE.setBold = function () {
    RE.expandRange();
    document.execCommand('bold', false, null);
    RE.restoreRange();
    RE.freshState();
}

RE.setItalic = function () {
    RE.expandRange();
    document.execCommand('italic', false, null);
    RE.restoreRange();
    RE.freshState();
}

RE.setSubscript = function () {
    document.execCommand('subscript', false, null);
}

RE.setSuperscript = function () {
    document.execCommand('superscript', false, null);
}

RE.setStrikeThrough = function () {
    document.execCommand('strikeThrough', false, null);
    RE.freshState();
}

RE.setUnderline = function () {
    RE.expandRange();
    document.execCommand('underline', false, null);
    RE.restoreRange();
    RE.freshState();
}

RE.setBullets = function () {
    document.execCommand('insertUnorderedList', false, null);
}

RE.setNumbers = function () {
    document.execCommand('insertOrderedList', false, null);
}

RE.setTextColor = function (color) {
    RE.restoreRange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('foreColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

RE.setTextBackgroundColor = function (color) {
    RE.restoreRange();
    document.execCommand("styleWithCSS", null, true);
    document.execCommand('hiliteColor', false, color);
    document.execCommand("styleWithCSS", null, false);
}

RE.setFontSize = function (fontSize) {
    document.execCommand("fontSize", false, fontSize);
}

RE.setHeading = function (heading) {
    document.execCommand('formatBlock', false, '<h' + heading + '>');
    RE.freshState();
}

RE.setIndent = function () {
    document.execCommand('indent', false, null);
}

RE.setOutdent = function () {
    document.execCommand('outdent', false, null);
}

RE.setJustifyLeft = function () {
    document.execCommand('justifyLeft', false, null);
    RE.freshState();
}

RE.setJustifyCenter = function () {
    document.execCommand('justifyCenter', false, null);
    RE.freshState();
}

RE.setJustifyRight = function () {
    document.execCommand('justifyRight', false, null);
    RE.freshState();
}

RE.setBlockquote = function () {
    document.execCommand('formatBlock', false, '<blockquote>');
}

RE.insertImage = function (url, alt) {
    var html = '<img src="' + url + '" alt="' + alt + '" />';
    RE.insertHTML(html);
}

RE.insertHTML = function (html) {
    RE.restoreRange();
    document.execCommand('insertHTML', false, html);
};

RE.addLink = function (link) {
    document.execCommand('CreateLink', "false", link);
};

RE.insertLink = function (url, title) {
    RE.restoreRange();
    var sel = document.getSelection();
    if (sel.toString().length == 0) {
        document.execCommand("insertHTML", false, "<a href='" + url + "'>" + title + "</a>");
    } else if (sel.rangeCount) {
        var el = document.createElement("a");
        el.setAttribute("href", url);
        el.setAttribute("title", title);

        var range = sel.getRangeAt(0).cloneRange();
        range.surroundContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    RE.callback();
}

RE.setTodo = function (text) {
    var html = '<input type="checkbox" name="' + text + '" value="' + text + '"/> &nbsp;';
    document.execCommand('insertHTML', false, html);
}

RE.prepareInsert = function () {
    RE.backupRange();
}

RE.backupRange = function () {
    var selection = window.getSelection();
    if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        RE.currentSelection = {
            "startContainer": range.startContainer,
            "startOffset": range.startOffset,
            "endContainer": range.endContainer,
            "endOffset": range.endOffset
        };
    }
}

RE.expandRange = function() {
    var sel = document.getSelection();
    if (sel.toString().length == 0) {
        var range = sel.getRangeAt(0).cloneRange();
        var r = sel.getRangeAt(0);
        r.setStart(r.startContainer, 0);
    }
}

RE.restoreRange = function () {
    var selection = window.getSelection();
    selection.removeAllRanges();
    var range = document.createRange();
    range.setStart(RE.currentSelection.startContainer, RE.currentSelection.startOffset);
    range.setEnd(RE.currentSelection.endContainer, RE.currentSelection.endOffset);
    selection.addRange(range);
}

var currentItem;
RE.freshState = function(bsave=true) {
    var items = [];
    if (document.queryCommandState('bold')) {
        items.push('bold');
    }
    if (document.queryCommandState('italic')) {
        items.push('italic');
    }
    if (document.queryCommandState('subscript')) {
        items.push('subscript');
    }
    if (document.queryCommandState('superscript')) {
        items.push('superscript');
    }
    if (document.queryCommandState('strikeThrough')) {
        items.push('strikeThrough');
    }
    if (document.queryCommandState('underline')) {
        items.push('underline');
    }
    if (document.queryCommandState('insertOrderedList')) {
        items.push('orderedList');
    }
    if (document.queryCommandState('insertUnorderedList')) {
        items.push('unorderedList');
    }
    if (document.queryCommandState('justifyCenter')) {
        items.push('justifyCenter');
    }
    if (document.queryCommandState('justifyFull')) {
        items.push('justifyFull');
    }
    if (document.queryCommandState('justifyLeft')) {
        items.push('justifyLeft');
    }
    if (document.queryCommandState('justifyRight')) {
        items.push('justifyRight');
    }
    if (document.queryCommandState('insertHorizontalRule')) {
        items.push('horizontalRule');
    }
    var formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock.length > 0) {
        items.push(formatBlock);
    }
    if (bsave) {
        currentItem = items;
    }
    window.location.href = "re-state://" + encodeURI(items.join(','));
}

RE.focus = function () {
    // var range = document.createRange();
    // range.selectNodeContents(RE.editor);
    // range.collapse(false);
    // var selection = window.getSelection();
    // selection.removeAllRanges();
    // selection.addRange(range);
    // RE.editor.focus();
    RE.editor.focus();
    var range = window.getSelection();//创建range
    range.selectAllChildren(RE.editor);//range 选择obj下所有子内容
    range.collapseToEnd();

    RE.freshState(false);
}

RE.blurFocus = function () {
    RE.editor.blur();
}

RE.removeFormat = function () {
    document.execCommand('removeFormat', false, null);
}

RE.integrationOnLineStyle = function () {
    if (currentItem.indexOf("h1") >= 0) {
        document.execCommand('formatBlock', false, '<h1>');
    }
    if (currentItem.indexOf("h3") >= 0) {
        document.execCommand('formatBlock', false, '<h3>');
    }
    if (currentItem.indexOf("h5") >= 0) {
        document.execCommand('formatBlock', false, '<h5>');
    }

    if (currentItem.indexOf("justifyCenter") >= 0) {
        document.execCommand("justifyCenter", false, null);
    }
    if (currentItem.indexOf("justifyLeft") >= 0) {
        document.execCommand("justifyLeft", false, null);
    }
    if (currentItem.indexOf("justifyRight") >= 0) {
        document.execCommand("justifyRight", false, null);
    }
}
// Event Listeners
RE.editor.addEventListener("keyup", function (e) {
    var KEY_LEFT = 37, KEY_RIGHT = 39, KEY_ENTER=13;
    if (e.which == KEY_LEFT || e.which == KEY_RIGHT) {
        RE.freshState();
    } else if (e.which == KEY_ENTER) {
        RE.integrationOnLineStyle();
    }
});
RE.editor.addEventListener("click", RE.freshState);
//document.addEventListener("selectionchange", function () { RE.freshState(); });
document.addEventListener("selectionchange", function () { RE.backupRange(); });
//window.addEventListener("touchend", RE.freshState);

RE.editor.addEventListener("input", RE.callback);

window.onload = function () {
    RE.editor.click();
    RE.editor.focus();
};