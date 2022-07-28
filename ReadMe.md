# Simple Collapse

Another collapse plugin for JavaScript.

## Install

```shell
npm install @erkenes/simple-collapse
```
```shell
yarn add @erkenes/simple-collapse
```

## How to use

### Simple Usage
```html
<div class="parent-element">
    <div class="collapse-trigger"
        data-collapse-target-selector=".collapse-item"
        data-collapse-target-is-brother="1"
        data-collapse-change-parent-class="1"
    >
        <button>The whole div is the trigger</button>
    </div>
    <div class="collapse-item"><!-- Default class for the target (required) -->
        <div class="collapse-item-wrapper"><!-- default class for the wrapper of the content (required) --> 
            <h1>Here is the content</h1>
            <p>
                Lorem ipsum
            </p>
        </div>
    </div>
</div>
```

### With Group

Collapse all other elements if a trigger is clicked.

```html
<div class="group-element">
    <div class="parent-element">
        <div class="collapse-trigger"
             data-collapse-target-selector=".collapse-item"
             data-collapse-target-is-brother="1"
             data-collapse-change-parent-class="1"
             data-collapse-group-selector=".group-element"
             data-collapse-group-id="group-one"
        >
            <button>The whole div is the trigger</button>
        </div>
        <div class="collapse-item"><!-- Default class for the target (required) -->
            <div class="collapse-item-wrapper"><!-- default class for the wrapper of the content (required) -->
                <h1>Here is the content</h1>
                <p>
                    Lorem ipsum
                </p>
            </div>
        </div>
    </div>
    <div class="parent-element">
        <div class="collapse-trigger"
             data-collapse-target-selector=".collapse-item"
             data-collapse-target-is-brother="1"
             data-collapse-change-parent-class="1"
             data-collapse-group-selector=".group-element"
             data-collapse-group-id="group-one"
        >
            <button>The whole div is the trigger</button>
        </div>
        <div class="collapse-item"><!-- Default class for the target (required) -->
            <div class="collapse-item-wrapper"><!-- default class for the wrapper of the content (required) -->
                <h1>Here is the content</h1>
                <p>
                    Lorem ipsum
                </p>
            </div>
        </div>
    </div>
</div>
```

### With external trigger

Collapse two elements with one trigger if the second element is not in the group:

```html
<div class="container">
    <div class="group-element">
        <div class="parent-element">
            <div class="collapse-trigger"
                 data-collapse-target-selector=".collapse-item"
                 data-collapse-target-is-brother="1"
                 data-collapse-change-parent-class="1"
                 data-collapse-group-selector=".group-element"
                 data-collapse-group-id="group-one"
                 data-collapse-external-common-parent=".container"
                 data-collapse-external-target=".external-one"
                 data-collapse-external-target-wrapper=".collapse-item-wrapper"
            >
                <button>The whole div is the trigger</button>
            </div>
            <div class="collapse-item"><!-- Default class for the target (required) -->
                <div class="collapse-item-wrapper"><!-- default class for the wrapper of the content (required) -->
                    <h1>Here is the content</h1>
                    <p>
                        Lorem ipsum
                    </p>
                </div>
            </div>
        </div>
        <div class="parent-element">
            <div class="collapse-trigger"
                 data-collapse-target-selector=".collapse-item"
                 data-collapse-target-is-brother="1"
                 data-collapse-change-parent-class="1"
                 data-collapse-group-selector=".group-element"
                 data-collapse-group-id="group-one"
                 data-collapse-external-common-parent=".container"
                 data-collapse-external-target=".external-two"
                 data-collapse-external-target-wrapper=".collapse-item-wrapper"
            >
                <button>The whole div is the trigger</button>
            </div>
            <div class="collapse-item"><!-- Default class for the target (required) -->
                <div class="collapse-item-wrapper"><!-- default class for the wrapper of the content (required) -->
                    <h1>Here is the content</h1>
                    <p>
                        Lorem ipsum
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="external-one">
            <div class="collapse-item-wrapper">
                Content - collapse with trigger one
            </div>
        </div>
        <div class="external-two">
            <div class="collapse-item-wrapper">
                Content - collapse with trigger two
            </div>
        </div>
    </div>
</div>
```