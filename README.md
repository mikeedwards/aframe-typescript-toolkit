# A-Frame + Typescript

This document will describe how to use the `aframe-typescript-toolkit` to create custom, shareable A-Frame components and systems using Typescript. This repository offers wrapper classes for A-Frame building blocks such as Components and Systems, making it easy to build A-Frame code that looks and feels like idiomatic Typescript code.

---

## Usage
The following is a brief tutorial on how to use `aframe-typescript-toolkit` to create and share A-Frame components with Typescript. This will be done in three parts:
```
1. Define and register a component or system class
2. Use your custom component in a local A-Frame project using webpack
3. Export your custom component via GitHub & RawGit to be shared and used in other A-Frame projects
```

### Creating A-Frame Components using Typescript
In this section, we'll discuss how to create an A-Frame component using Typescript.
#### 1. install `aframe-typescript-toolkit`
```javascript
npm install aframe-typescript-toolkit 
// or  yarn add aframe-typescript-toolkit
```
#### 2. create an `index.ts` and import `ComponentWrapper` and `EntityBuilder`
```typescript
import { ComponentWrapper, EntityBuilder } from "aframe-typescript-toolkit"
```
#### 3. Define a schema for your component's data
```typescript
interface NewComponentSchema {
    readonly color: string
}
```
#### 4. Define your component class by extending ComponentWrapper
```typescript
export class NewComponent extends ComponentWrapper<NewComponentSchema> {

    constructor() {
        super("new-component", {
            color: {
                type: "string",
                default: "colorless",
            }, 
        })
    }
    
    init() {
        const entityColor = this.el.getAttribute("color")
        EntityBuilder.create("a-text", {
            id: "color-text",
            value: entityColor || this.data.color,
            color: entityColor || "black",
            position: "-1 1.25 0",
        }).attachTo(this.el)
    }
}
```
#### 5. Register your component
at the bottom of your `index.ts` file, after defining your component register it so it can be used in your A-Frame scene.
```typescript
new NewComponent().register()
```
### Using your Custom Component Locally
To use your custom component locally, your typescript file must be compiled into javascript. webpack is a convenient tool to accomplish this. 
#### 1. Create your webpack.config.js
In the root directory of your project, create a file called `webpack.config.js`. You can configure your webpack to suit your needs. However, if you're new to webpack or don't require a custom setup, you can copy the [webpack config from one of our examples](https://GitHub.com/olioapps/aframe-typescript-toolkit/blob/master/examples/sphere_registry_system/webpack.config.js)

See the [webpack](https://webpack.js.org/concepts/)documentation for more details. 
#### 2. Include and Install all dependencies
Like the webpack config, you might find it easier to copy the dependencies from one of our [examples](https://GitHub.com/olioapps/aframe-typescript-toolkit/blob/master/examples/sphere_registry_system/package.json) into your `package.json` file. 

Then run `npm install` to install all dependencies 

#### 3. Add build scripts
If you have copied the webpack config and dependencies, you can also copy the build scripts from the [example](https://GitHub.com/olioapps/aframe-typescript-toolkit/blob/master/examples/sphere_registry_system/package.json) into your project's `package.json` file.
```json
    ...
    "scripts": {
        "build": "cross-env NODE_ENV=production webpack --config ./webpack.config.js  --progress --profile --color --display-error-details --display-cached --bail",
    ...
```
#### 4. Make a build
In your command line, run `npm build` to create a production build using webpack. 

You will see `./dist` and `./dist-umd` directories have been created inside of your root directory (or otherwise if you used a custom webpack configuration).

#### 5. Create an index.html A-Frame Scene
In your `index.html` file (in the root directory), include the scripts for A-Frame as well as your custom component (`dist-umd/index.js`).

In the A-Frame scene, create an entity using your component by including the component's name defined in the constructor. In this example, the component's name is `new-component`. 

```html
<html>
    <head>
        <!-- This is the A-Frame CDN -->
        <script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
        
        
        <!-- This is the file you created in the previous step -->
        <script type="text/javascript" src="dist-umd/index.js"></script>
    </head>
    <body>
        <a-scene embedded antialias="true">
            <a-sphere 
                color="red" 
                position="-1 2 -5"
                new-component 
            >
            </a-sphere>
            <!-- 'new-component' is the name we gave our component in the constructor-->
            <a-box
                position="2 3 -10"
                new-component
            >
            </a-box>
            <a-sky color="#ECECEC"></a-sky>
            <a-light position="0 10 0" color="white" type="point"></a-light>
        </a-scene>
    </body>
</html>
```
#### 6. View your A-Frame Scene
Locally serve your project to see what you've created. You can run a command like `python -m SimpleHTTPServer 3000` from your root directory and then visit your web browser at http://localhost:3000/. 

Remember, if you make any changes to your `index.ts` file, you'll have to rebuild your project using `npm build` to see the changes.

<img src="./assets/new-component.png" alt="red ball and colorless box">

### Exporting Custom Components
Seeing your component run locally is great. Now it is time to export it so it can be used by others. There are many ways to do this. One free and convenient way is through GitHub and RawGit

#### 1. Publish your project to GitHub 
See [GitHub's docs](https://help.GitHub.com/) if you are not familiar with this process. 

#### 2. Create a CDN for your component class
Paste the GitHub link to your `dist-umd/index.js` file into [RawGit.com](https://RawGit.com/). 
Example GitHub url: `https://GitHub.com/[username]/[aframe-typescript-project]/blob/master/dist-umd/index.js`

RawGit will serve your raw file with proper Content-Type headers and generate a url for you to share.

---

## A-Frame Typescript Classes 

### EntityBuilder
Entity builder allows you to create A-Frame entities, set attributes, and attach them to the scene other A-Frame elements. 
```javascript
import { EntityBuilder } from "aframe-typescript-toolkit"

const scene = document.getElementById("scene")

EntityBuilder.create("a-text", {
    id: "hello-text",
    value: "Hello Word!",
    color: "blue",
    position: "-1 2 0",
}).attachTo(scene)
```
See the docs for additional information on [EntityBuilder](https://cdn.RawGit.com/olioapps/aframe-typescript-toolkit/199aa562/dist/docs/classes/_entity_builder_.entitybuilder.html)

### ComponentWrapper
The ComponentWrapper is a base class for creating strongly typed A-Frame components. Component lifecycle methods such as init(), tick(), and others are provided, and can be overridden to suit your component's specific behavior.

See the [example](https://GitHub.com/olioapps/aframe-typescript-toolkit/tree/master/examples/position_logger_component) as well as the [ComponentWrapper docs](https://cdn.RawGit.com/olioapps/aframe-typescript-toolkit/199aa562/dist/docs/classes/_aframe_wrapper_.componentwrapper.html) for more details. 

### SystemWrapper
The SystemWrapper allows you to create typescript A-Frame systems. Components can subscribe themselves to a system, allowing the system to reference its components.

See the [example](https://GitHub.com/olioapps/aframe-typescript-toolkit/tree/master/examples/sphere_registry_system) as well as the [SystemWrapper docs](https://cdn.RawGit.com/olioapps/aframe-typescript-toolkit/199aa562/dist/docs/classes/_aframe_wrapper_.systemwrapper.html) for more details. 

---

## Examples 
### [Position Logger](https://GitHub.com/olioapps/aframe-typescript-toolkit/tree/master/examples/position_logger_component)
Position Logger A-Frame Component is a complete example of how to use an A-Frame component using `ComponentWrapper`


### [Sphere Registry System](https://GitHub.com/olioapps/aframe-typescript-toolkit/tree/master/examples/sphere_registry_system)
 Sphere Registry A-Frame System is a complete example of a how to create an A-Frame system using `SystemWrapper`

---

## Contact
We are interested in hearing your questions and feedback.

Email: [vr@olioapps.com](vr@olioapps.com)

---

## Additional Reading 
- [aframe-typescript-toolkit Docs](https://cdn.RawGit.com/olioapps/aframe-typescript-toolkit/199aa562/dist/docs/index.html)
- [A-Frame](https://aframe.io/)
- [Typescript](https://www.typescriptlang.org/docs/home.html)

---

## License
This program is free software and is distributed under an MIT License.
