/**
 * Builds the HTML for a single contact row inside the contacts dropdown.
 * @param {string} initials - The contact's initials
 * @param {string} name - The contact's full name
 * @param {string} color - The contact's color code
 * @param {string|number} id - The unique contact ID
 * @param {boolean} checked - Whether the checkbox is pre-checked
 * @returns {string} HTML string for the contact row
 */
function renderContactHTML(initials, name, color, id, checked) {
    return `    
    <ul class="contact-row">
    <label class="checkbox">
        <div class="contact-left">
            <span class="initials-circle" style="background-color: ${color};">
                ${initials}
            </span>
            <span class="contact-name">${name}</span>
        </div>        
            <input class="checkbox-input" type="checkbox" ${checked ? "checked" : ""} onclick="toggleContact('${id}')">
            <span class="checkbox-box"></span>
        </label>
    </ul>
    `;
}

/**
 * Builds the HTML for a contact row used in the contact search UI.
 * @param {string} initials - The contact's initials
 * @param {string} name - The contact's full name
 * @param {string} color - The contact's color code
 * @returns {string} HTML string for the contact search row
 */
function renderContactSearchHTML(initials, name, color) {
    return `    
    <ul class="contact-row">
        <div class="contact-left">
            <span class="initials-circle" style="background-color: ${color};">${initials}</span>
            <span class="contact-name">${name}</span>
        </div>
        <label class="checkbox">
            <input id="checkbox" class="checkbox-input" name="checked" type="checkbox" value="">
            <span class="checkbox-box"></span>
        </label>
    </ul>
    `;
}

/**
 * Builds the HTML for a single selected contact initials badge.
 * @param {{color: string, initials: string}} contact - The contact object
 * @returns {string} HTML string for the initials badge
 */
function letterInitials(contact) {
    return `
    <span class="initials-circle" style="background-color: ${contact.color}">
        ${contact.initials}
    </span>
    `;
}

/**
 * Builds the HTML for an overflow badge showing remaining contacts count.
 * @param {number} count - The number of additional contacts
 * @returns {string} HTML string for the overflow badge
 */
function renderOverflowBadge(count) {
    return `<span class="initials-circle counter">
            + ${count}
            </span>
    `;
}

/**
 * Builds the HTML for a single subtask list entry.
 * @param {string} subTaskInput - The subtask text content
 * @param {number} i - The index of the subtask
 * @returns {string} HTML string for the subtask item
 */
function renderSubtaskItemHTML(subTaskInput, i) {
    return `
    <div class="sub-container" data-index="${i}">
        <span class="display-flex">&bull; ${subTaskInput}</span>
        <div class="hover-show">
            <img src="../assets/img/Subtasks change.svg" class="input-icon-cancel" onclick="changeSubtask(${i})">
            <div class="seperator-small"></div>
            <img src="../assets/img/SubTask delete.svg" class="input-icon-accept" onclick="deleteSubtask(${i})">
        </div>
    </div>
    </div>
    `;
}

/**
 * Builds the HTML for editing a single subtask entry.
 * @param {number} i - The index of the subtask
 * @param {string} currentValue - The current text value
 * @returns {string} HTML string for the editable subtask form
 */
function renderEditSubtaskForm(i, currentValue) {
    return `<div class="input-wrapper"><input type="text" value="${currentValue}" id="edit-input-${i}"
    title="Enter the new text">    
    <div class="img-container" style="display: flex;">
    <img src="../assets/img/Subtasks accept.svg" class="input-icon-accept" onclick="saveSubtaskEdit(${i})">
    <div class="seperator-small"></div>
    <img src="../assets/img/Subtasks cancel.svg" class="input-icon-cancel" onclick="renderSubtasks()">
    </div>    
    `;
}