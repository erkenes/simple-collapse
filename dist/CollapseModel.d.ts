declare global {
    interface Window {
        CollapseElements: any;
    }
}
declare class CollapseModel {
    #private;
    static readonly dataTargetSelector: string;
    static readonly dataWithinParent: string;
    static readonly dataChangeParentClass: string;
    static readonly dataGroupSelector: string;
    static readonly dataGroupId: string;
    static readonly classNameTrigger: string;
    static readonly classNameItemCollapsed: string;
    static readonly classNameParentCollapsed: string;
    static readonly classNameWrapper: string;
    private readonly classNameTrigger;
    private readonly classNameItemCollapsed;
    private readonly classNameParentCollapsed;
    private readonly classNameWrapper;
    readonly trigger: HTMLElement;
    readonly target: HTMLElement;
    readonly parent: HTMLElement;
    readonly wrapper: HTMLElement;
    readonly targetSelector: string;
    readonly withinParent: boolean;
    readonly changeParentClass: boolean;
    readonly groupSelector: string | null;
    readonly groupId: string | null;
    readonly guid: string;
    constructor(triggerElement: HTMLElement, classNameTrigger?: string, classNameWrapper?: string, classNameItemCollapsed?: string, classNameParentCollapsed?: string, targetSelector?: string | null, withinParent?: boolean | null, changeParentClass?: boolean | null, groupSelector?: string | null, groupId?: string | null);
    /**
     * Expand target
     */
    open: () => void;
    /**
     * Collapse target
     */
    close: () => void;
    /**
     * Toggle close/open of the target
     */
    toggle: () => void;
    /**
     * Close all elements of the group
     *
     * @param skipCurrentTrigger skip this element/target mapped by the trigger
     */
    closeGroup: (skipCurrentTrigger?: boolean) => void;
    /**
     * Get the target element
     *
     * @return HTMLElement
     * @private
     */
    private getTarget;
    /**
     * Get the wrapper element of the target
     *
     * @return HTMLElement
     * @private
     */
    private getWrapper;
    /**
     * @return HTMLElement
     * @private
     */
    private getParent;
    /**
     * returns all triggers that are of the same group
     *
     * @param skipCurrentTrigger skip this element/target mapped by the trigger
     * @return {NodeListOf<HTMLElement>}
     */
    getGroupElements: (skipCurrentTrigger?: boolean) => Element[] | undefined;
    /**
     * Generate a pseudo guid
     */
    private pseudoGuid;
    /**
     * Initialize all collapse elements matching to the given selector
     *
     * @param classNameTrigger the class name of the trigger
     * @param classNameWrapper the class name of the wrapper
     * @param classNameItemCollapsed the class name if the target is collapsed
     * @param classNameParentCollapsed the class name if the target is collapsed for the parent
     */
    static initializeAll: (classNameTrigger?: string, classNameWrapper?: string, classNameItemCollapsed?: string, classNameParentCollapsed?: string) => void;
}
export default CollapseModel;
