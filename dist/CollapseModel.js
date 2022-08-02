var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CollapseModel_init;
class CollapseModel {
    constructor(triggerElement, classNameTrigger = 'collapse-trigger', classNameWrapper = 'collapse-item-wrapper', classNameItemCollapsed = 'collapse-item-collapsed', classNameParentCollapsed = 'collapse-child-item-collapsed', targetSelector = null, withinParent = null, changeParentClass = null, groupSelector = null, groupId = null, externalCommonParent = null, externalTarget = null, externalTargetWrapper = null) {
        var _a, _b, _c;
        this.classNameTrigger = 'collapse-trigger';
        this.classNameItemCollapsed = 'collapse-item-collapsed';
        this.classNameParentCollapsed = 'collapse-child-item-collapsed';
        this.classNameWrapper = 'collapse-item-wrapper';
        this.withinParent = false;
        this.externalTarget = null;
        this.externalTargetWrapper = null;
        this.externalCommonParent = null;
        this.changeParentClass = false;
        this.groupSelector = null;
        this.groupId = null;
        this.guid = '';
        /**
         * Expand target
         */
        this.open = () => {
            this.target.style.height = this.wrapper.clientHeight + 'px';
            this.target.classList.remove(this.classNameItemCollapsed);
            if (this.externalTarget && this.externalTargetWrapper) {
                this.externalTarget.style.height = this.externalTargetWrapper.clientHeight + 'px';
                this.externalTarget.classList.remove(this.classNameItemCollapsed);
            }
            if (this.withinParent && this.changeParentClass) {
                this.parent.classList.remove(this.classNameParentCollapsed);
            }
        };
        /**
         * Collapse target
         */
        this.close = () => {
            this.target.style.height = '0';
            this.target.classList.add(this.classNameItemCollapsed);
            if (this.externalTarget && this.externalTargetWrapper) {
                this.externalTarget.style.height = '0';
                this.externalTarget.classList.add(this.classNameItemCollapsed);
            }
            if (this.withinParent && this.changeParentClass) {
                this.parent.classList.add(this.classNameParentCollapsed);
            }
        };
        /**
         * Toggle close/open of the target
         */
        this.toggle = () => {
            if (this.target.classList.contains(this.classNameItemCollapsed)) {
                this.open();
            }
            else {
                this.close();
            }
        };
        /**
         * Close all elements of the group
         *
         * @param skipCurrentTrigger skip this element/target mapped by the trigger
         */
        this.closeGroup = (skipCurrentTrigger = false) => {
            var _a;
            if (this.groupId) {
                let groupElements = Array.from((_a = this.getGroupElements(skipCurrentTrigger)) !== null && _a !== void 0 ? _a : []);
                if (groupElements.length) {
                    groupElements.forEach(el => {
                        var _a;
                        const guid = (_a = el.dataset.collapseItemGuid) !== null && _a !== void 0 ? _a : null;
                        if (guid !== null
                            && guid !== ''
                            && window.hasOwnProperty('CollapseElements')
                            && window.CollapseElements.hasOwnProperty(guid)) {
                            const currentElement = window.CollapseElements[guid];
                            if (currentElement) {
                                currentElement.close();
                            }
                        }
                    });
                }
            }
        };
        /**
         * Get the target element
         *
         * @return HTMLElement
         * @private
         */
        this.getTarget = () => {
            const target = this.parent.querySelector(this.targetSelector);
            if (target) {
                return target;
            }
            else {
                throw new Error('No Target was found');
            }
        };
        /**
         * Get the wrapper element of the target
         *
         * @return HTMLElement
         * @private
         */
        this.getWrapper = () => {
            const wrapper = this.target.querySelector('.' + this.classNameWrapper);
            if (wrapper) {
                return wrapper;
            }
            else {
                throw new Error('There is no wrapper element!');
            }
        };
        /**
         * @return HTMLElement
         * @private
         */
        this.getParent = () => {
            if (this.withinParent) {
                const parentElement = this.trigger.parentElement;
                if (parentElement) {
                    return parentElement;
                }
                throw new Error('Parent not found!');
            }
            return document.documentElement;
        };
        /**
         * Get the external common parent if set
         *
         * @param{HTMLElement|null} externalCommonParent
         */
        this.getExternalCommonParent = (externalCommonParent) => {
            var _a, _b;
            if (!externalCommonParent) {
                const dataExternalCommonParent = (_a = this.trigger.dataset[CollapseModel.dataExternalCommonParent]) !== null && _a !== void 0 ? _a : '';
                if (dataExternalCommonParent !== '') {
                    return (_b = this.target.closest(dataExternalCommonParent)) !== null && _b !== void 0 ? _b : null;
                }
            }
            return null;
        };
        /**
         * Get the external target if set
         *
         * @param{HTMLElement|null} externalTarget
         */
        this.getExternalTarget = (externalTarget) => {
            var _a, _b;
            if (!externalTarget) {
                const dataExternalTarget = (_a = this.trigger.dataset[CollapseModel.dataExternalTarget]) !== null && _a !== void 0 ? _a : '';
                if (dataExternalTarget !== '' && this.externalCommonParent) {
                    return (_b = this.externalCommonParent.querySelector(dataExternalTarget)) !== null && _b !== void 0 ? _b : null;
                }
            }
            return null;
        };
        /**
         * Get the external target wrapper if set
         *
         * @param{HTMLElement|null} externalTargetWrapper
         */
        this.getExternalTargetWrapper = (externalTargetWrapper) => {
            var _a, _b;
            if (!externalTargetWrapper) {
                const dataExternalTargetWrapper = (_a = this.trigger.dataset[CollapseModel.dataExternalTargetWrapper]) !== null && _a !== void 0 ? _a : '';
                if (dataExternalTargetWrapper !== '' && this.externalTarget) {
                    return (_b = this.externalTarget.querySelector(dataExternalTargetWrapper)) !== null && _b !== void 0 ? _b : null;
                }
            }
            return null;
        };
        /**
         * returns all triggers that are of the same group
         *
         * @param skipCurrentTrigger skip this element/target mapped by the trigger
         * @return {NodeListOf<HTMLElement>}
         */
        this.getGroupElements = (skipCurrentTrigger = false) => {
            if (this.groupId) {
                let searchElement;
                if (this.groupSelector) {
                    searchElement = this.target.closest(this.groupSelector);
                }
                else {
                    searchElement = document.documentElement;
                }
                if (!searchElement) {
                    throw new Error('Search Element for Group cannot be set!');
                }
                let groupElements = Array.from(searchElement.querySelectorAll('[data-collapse-group-id="' + this.groupId + '"]'));
                if (groupElements.length) {
                    if (skipCurrentTrigger) {
                        groupElements = groupElements.filter(data => data != this.trigger);
                    }
                    return groupElements;
                }
                return [];
            }
        };
        /**
         * Generate a pseudo guid
         */
        this.pseudoGuid = () => {
            const fourChars = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
            };
            return 'item_' + (fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
        };
        /**
         * Initialize the classes
         *
         * @private
         */
        _CollapseModel_init.set(this, () => {
            this.target.classList.add(this.classNameItemCollapsed);
            if (this.withinParent && this.changeParentClass) {
                this.parent.classList.add(this.classNameParentCollapsed);
            }
        }
        /**
         * Initialize all collapse elements matching to the given selector
         *
         * @param classNameTrigger the class name of the trigger
         * @param classNameWrapper the class name of the wrapper
         * @param classNameItemCollapsed the class name if the target is collapsed
         * @param classNameParentCollapsed the class name if the target is collapsed for the parent
         */
        );
        if (!triggerElement) {
            throw new Error('No trigger was set');
        }
        this.targetSelector = targetSelector !== null && targetSelector !== void 0 ? targetSelector : ((_a = triggerElement.dataset[CollapseModel.dataTargetSelector]) !== null && _a !== void 0 ? _a : '');
        this.classNameTrigger = classNameTrigger !== null && classNameTrigger !== void 0 ? classNameTrigger : CollapseModel.classNameTrigger;
        this.classNameItemCollapsed = classNameItemCollapsed !== null && classNameItemCollapsed !== void 0 ? classNameItemCollapsed : CollapseModel.classNameItemCollapsed;
        this.classNameParentCollapsed = classNameParentCollapsed !== null && classNameParentCollapsed !== void 0 ? classNameParentCollapsed : CollapseModel.classNameParentCollapsed;
        this.classNameWrapper = classNameWrapper !== null && classNameWrapper !== void 0 ? classNameWrapper : CollapseModel.classNameWrapper;
        if (!this.targetSelector) {
            throw new Error('No target was found');
        }
        this.trigger = triggerElement;
        this.withinParent = withinParent !== null && withinParent !== void 0 ? withinParent : triggerElement.dataset[CollapseModel.dataWithinParent] == "1";
        this.changeParentClass = changeParentClass !== null && changeParentClass !== void 0 ? changeParentClass : triggerElement.dataset[CollapseModel.dataChangeParentClass] === "1";
        this.groupSelector = (_b = groupSelector !== null && groupSelector !== void 0 ? groupSelector : triggerElement.dataset[CollapseModel.dataGroupSelector]) !== null && _b !== void 0 ? _b : null;
        this.groupId = (_c = groupId !== null && groupId !== void 0 ? groupId : triggerElement.dataset[CollapseModel.dataGroupId]) !== null && _c !== void 0 ? _c : null;
        this.parent = this.getParent();
        this.target = this.getTarget();
        this.wrapper = this.getWrapper();
        this.guid = this.pseudoGuid();
        this.trigger.dataset.collapseItemGuid = this.guid;
        this.externalCommonParent = this.getExternalCommonParent(externalCommonParent);
        if (this.externalCommonParent) {
            this.externalTarget = this.getExternalTarget(externalTarget);
            this.externalTargetWrapper = this.getExternalTargetWrapper(externalTargetWrapper);
            if (!this.externalTarget) {
                throw new Error('The external-common-parent is set, but not external-target!');
            }
            if (!this.externalTargetWrapper) {
                throw new Error('The external-common-parent is set, but not external-target-wrapper!');
            }
        }
        __classPrivateFieldGet(this, _CollapseModel_init, "f").call(this);
        if (!window.hasOwnProperty('CollapseElements')) {
            window.CollapseElements = [];
        }
        window.CollapseElements[this.guid] = this;
        triggerElement.addEventListener('click', () => {
            this.closeGroup(true);
            this.toggle();
        }, false);
    }
}
_CollapseModel_init = new WeakMap();
CollapseModel.dataTargetSelector = 'collapseTargetSelector';
CollapseModel.dataWithinParent = 'collapseTargetIsBrother';
CollapseModel.dataChangeParentClass = 'collapseChangeParentClass';
CollapseModel.dataGroupSelector = 'collapseGroupSelector';
CollapseModel.dataGroupId = 'collapseGroupId';
CollapseModel.dataExternalTarget = 'collapseExternalTarget';
CollapseModel.dataExternalCommonParent = 'collapseExternalCommonParent';
CollapseModel.dataExternalTargetWrapper = 'collapseExternalTargetWrapper';
CollapseModel.classNameTrigger = 'collapse-trigger';
CollapseModel.classNameItemCollapsed = 'collapse-item-collapsed';
CollapseModel.classNameParentCollapsed = 'collapse-child-item-collapsed';
CollapseModel.classNameWrapper = 'collapse-item-wrapper';
/**
 * Initialize all collapse elements matching to the given selector
 *
 * @param classNameTrigger the class name of the trigger
 * @param classNameWrapper the class name of the wrapper
 * @param classNameItemCollapsed the class name if the target is collapsed
 * @param classNameParentCollapsed the class name if the target is collapsed for the parent
 */
CollapseModel.initializeAll = (classNameTrigger = 'collapse-trigger', classNameWrapper = 'collapse-item-wrapper', classNameItemCollapsed = 'collapse-item-collapsed', classNameParentCollapsed = 'collapse-child-item-collapsed') => {
    const elements = Array.from(document.querySelectorAll('.' + classNameTrigger));
    if (elements.length) {
        elements.forEach(collapse => {
            new CollapseModel(collapse, classNameTrigger, classNameWrapper, classNameItemCollapsed, classNameParentCollapsed);
        });
    }
};
export default CollapseModel;
