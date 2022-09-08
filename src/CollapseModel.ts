declare global {
    interface Window { CollapseElements: any; }
}

class CollapseModel
{
    static readonly dataTargetSelector: string = 'collapseTargetSelector';
    static readonly dataWithinParent: string = 'collapseTargetIsBrother';
    static readonly dataChangeParentClass: string = 'collapseChangeParentClass';
    static readonly dataGroupSelector: string = 'collapseGroupSelector';
    static readonly dataGroupId: string = 'collapseGroupId';
    static readonly dataExternalTarget: string = 'collapseExternalTarget';
    static readonly dataExternalCommonParent: string = 'collapseExternalCommonParent';
    static readonly dataExternalTargetWrapper: string = 'collapseExternalTargetWrapper';
    static readonly dataOpenOnInit: string = 'collapseOpenInit';
    static readonly classNameTrigger: string = 'collapse-trigger';
    static readonly classNameItemCollapsed: string = 'collapse-item-collapsed';
    static readonly classNameParentCollapsed: string = 'collapse-child-item-collapsed';
    static readonly classNameWrapper: string = 'collapse-item-wrapper';

    private readonly classNameTrigger: string = 'collapse-trigger';
    private readonly classNameItemCollapsed: string = 'collapse-item-collapsed';
    private readonly classNameParentCollapsed: string = 'collapse-child-item-collapsed';
    private readonly classNameWrapper: string = 'collapse-item-wrapper';

    public readonly trigger: HTMLElement;
    public readonly target: HTMLElement;
    public readonly parent: HTMLElement;
    public readonly wrapper: HTMLElement
    public readonly targetSelector: string;
    public readonly withinParent: boolean = false;
    public readonly externalTarget: HTMLElement|null = null;
    public readonly externalTargetWrapper: HTMLElement|null = null;
    public readonly externalCommonParent: HTMLElement|null = null;
    public readonly openOnInit: boolean = false;
    public readonly changeParentClass: boolean = false;
    public readonly groupSelector: string|null = null;
    public readonly groupId: string|null = null;
    public readonly guid: string = '';

    constructor(
        triggerElement: HTMLElement,
        classNameTrigger: string = 'collapse-trigger',
        classNameWrapper: string = 'collapse-item-wrapper',
        classNameItemCollapsed: string = 'collapse-item-collapsed',
        classNameParentCollapsed: string = 'collapse-child-item-collapsed',
        targetSelector: string|null = null,
        withinParent: boolean|null = null,
        changeParentClass: boolean|null = null,
        groupSelector: string|null = null,
        groupId: string|null = null,
        externalCommonParent: HTMLElement|null = null,
        externalTarget: HTMLElement|null = null,
        externalTargetWrapper: HTMLElement|null = null,
        openOnInit: boolean|null = null
    ) {
        if (!triggerElement) {
            throw new Error('No trigger was set');
        }
        this.targetSelector = targetSelector ?? (triggerElement.dataset[CollapseModel.dataTargetSelector] ?? '');
        this.classNameTrigger = classNameTrigger ?? CollapseModel.classNameTrigger;
        this.classNameItemCollapsed = classNameItemCollapsed ?? CollapseModel.classNameItemCollapsed;
        this.classNameParentCollapsed = classNameParentCollapsed ?? CollapseModel.classNameParentCollapsed;
        this.classNameWrapper = classNameWrapper ?? CollapseModel.classNameWrapper;

        if (!this.targetSelector) {
            throw new Error('No target was found');
        }

        this.trigger = triggerElement;
        this.withinParent = withinParent ?? triggerElement.dataset[CollapseModel.dataWithinParent] == "1";
        this.changeParentClass = changeParentClass?? triggerElement.dataset[CollapseModel.dataChangeParentClass] === "1";
        this.groupSelector = groupSelector ?? triggerElement.dataset[CollapseModel.dataGroupSelector] ?? null;
        this.groupId = groupId ?? triggerElement.dataset[CollapseModel.dataGroupId] ?? null;

        this.parent = this.getParent();
        this.target = this.getTarget();
        this.wrapper = this.getWrapper();
        this.guid = this.pseudoGuid();
        this.trigger.dataset.collapseItemGuid = this.guid;
        this.openOnInit = openOnInit ?? triggerElement.dataset[CollapseModel.dataOpenOnInit] == "1";

        this.externalCommonParent = <HTMLElement|null>this.getExternalCommonParent(externalCommonParent);
        if (this.externalCommonParent) {
            this.externalTarget = <HTMLElement|null>this.getExternalTarget(externalTarget);
            this.externalTargetWrapper = <HTMLElement|null>this.getExternalTargetWrapper(externalTargetWrapper);

            if (!this.externalTarget) {
                throw new Error('The external-common-parent is set, but not external-target!');
            }
            if (!this.externalTargetWrapper) {
                throw new Error('The external-common-parent is set, but not external-target-wrapper!');
            }
        }
        
        this.initialize();

        if (!window.hasOwnProperty('CollapseElements')) {
            window.CollapseElements = [];
        }
        window.CollapseElements[this.guid] = this;

        triggerElement.addEventListener('click', () => {
            this.closeGroup(true);
            this.toggle();
        }, false);
    }

    /**
     * Expand target
     */
    public open = () => {
        this.target.style.height = this.wrapper.clientHeight + 'px';
        this.target.classList.remove(this.classNameItemCollapsed);

        if (this.externalTarget && this.externalTargetWrapper) {
            this.externalTarget.style.height = this.externalTargetWrapper.clientHeight + 'px';
            this.externalTarget.classList.remove(this.classNameItemCollapsed);
        }

        if (this.withinParent && this.changeParentClass) {
            this.parent.classList.remove(this.classNameParentCollapsed);
        }
    }

    /**
     * Collapse target
     */
    public close = () => {
        this.target.style.height = '0';
        this.target.classList.add(this.classNameItemCollapsed);

        if (this.externalTarget && this.externalTargetWrapper) {
            this.externalTarget.style.height = '0';
            this.externalTarget.classList.add(this.classNameItemCollapsed);
        }

        if (this.withinParent && this.changeParentClass) {
            this.parent.classList.add(this.classNameParentCollapsed);
        }
    }

    /**
     * Toggle close/open of the target
     */
    public toggle = () => {
        if (this.target.classList.contains(this.classNameItemCollapsed)) {
            this.open();
        } else {
            this.close();
        }
    }

    /**
     * Close all elements of the group
     *
     * @param skipCurrentTrigger skip this element/target mapped by the trigger
     */
    public closeGroup = (skipCurrentTrigger: boolean = false) => {
        if (this.groupId) {
            let groupElements = Array.from(this.getGroupElements(skipCurrentTrigger) ?? []);

            if (groupElements.length) {
                groupElements.forEach(el => {
                    const guid = (<HTMLElement>el).dataset.collapseItemGuid ?? null;

                    if (
                        guid !== null
                        && guid !== ''
                        && window.hasOwnProperty('CollapseElements')
                        && window.CollapseElements.hasOwnProperty(guid)) {
                        const currentElement = <CollapseModel>window.CollapseElements[guid];

                        if (currentElement) {
                            currentElement.close();
                        }
                    }
                });
            }
        }
    }

    /**
     * Get the target element
     *
     * @return HTMLElement
     * @private
     */
    private getTarget = () => {
        const target = this.parent.querySelector(this.targetSelector);

        if (target) {
            return <HTMLElement>target;
        } else {
            throw new Error('No Target was found');
        }
    };

    /**
     * Get the wrapper element of the target
     *
     * @return HTMLElement
     * @private
     */
    private getWrapper = () => {
        const wrapper = this.target.querySelector('.' + this.classNameWrapper);

        if (wrapper) {
            return <HTMLElement>wrapper;
        }
        else {
            throw new Error('There is no wrapper element!');
        }
    };

    /**
     * @return HTMLElement
     * @private
     */
    private getParent = () => {
        if (this.withinParent) {
            const parentElement = this.trigger.parentElement;

            if (parentElement) {
                return parentElement
            }
            throw new Error('Parent not found!');
        }

        return document.documentElement;
    }

    /**
     * Get the external common parent if set
     *
     * @param{HTMLElement|null} externalCommonParent
     */
    private getExternalCommonParent = (externalCommonParent: HTMLElement|null) => {
        if (!externalCommonParent) {
            const dataExternalCommonParent = this.trigger.dataset[CollapseModel.dataExternalCommonParent] ?? '';

            if (dataExternalCommonParent !== '') {
                return <HTMLElement>this.target.closest(dataExternalCommonParent) ?? null;
            }
        }

        return null;
    }

    /**
     * Get the external target if set
     *
     * @param{HTMLElement|null} externalTarget
     */
    private getExternalTarget = (externalTarget: HTMLElement|null) => {
        if (!externalTarget) {
            const dataExternalTarget = this.trigger.dataset[CollapseModel.dataExternalTarget] ?? '';

            if (dataExternalTarget !== '' && this.externalCommonParent) {
                return <HTMLElement>this.externalCommonParent.querySelector(dataExternalTarget) ?? null;
            }
        }

        return null;
    }

    /**
     * Get the external target wrapper if set
     *
     * @param{HTMLElement|null} externalTargetWrapper
     */
    private getExternalTargetWrapper = (externalTargetWrapper: HTMLElement|null) => {
        if (!externalTargetWrapper) {
            const dataExternalTargetWrapper = this.trigger.dataset[CollapseModel.dataExternalTargetWrapper] ?? '';

            if (dataExternalTargetWrapper !== '' && this.externalTarget) {
                return <HTMLElement>this.externalTarget.querySelector(dataExternalTargetWrapper) ?? null;
            }
        }

        return null;
    }

    /**
     * returns all triggers that are of the same group
     *
     * @param skipCurrentTrigger skip this element/target mapped by the trigger
     * @return {NodeListOf<HTMLElement>}
     */
    public getGroupElements = (skipCurrentTrigger: boolean = false) => {
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
    }

    /**
     * Generate a pseudo guid
     */
    private pseudoGuid = () => {
        const fourChars = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
        }
        return 'item_' + (fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
    }

    /**
     * Initialize the classes
     *
     * @private
     */
    private initialize = () => {
        if (this.openOnInit) {
            this.open();
        }
        else {
            this.close();
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
    static initializeAll = (
        classNameTrigger: string = 'collapse-trigger',
        classNameWrapper: string = 'collapse-item-wrapper',
        classNameItemCollapsed: string = 'collapse-item-collapsed',
        classNameParentCollapsed: string = 'collapse-child-item-collapsed'

    ) => {
        const elements = Array.from(document.querySelectorAll('.' + classNameTrigger));

        if (elements.length) {
            elements.forEach(collapse => {
                new CollapseModel(
                    (<HTMLElement>collapse),
                    classNameTrigger,
                    classNameWrapper,
                    classNameItemCollapsed,
                    classNameParentCollapsed
                );
            });
        }
    }
}

export default CollapseModel;
