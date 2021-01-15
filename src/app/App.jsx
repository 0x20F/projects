import React, {Component} from 'react';
import { data } from './data';



export default class App extends Component {
    constructor(props) {
        super(props);

        this.projects = data;
    }

    render() {
        let keys = Object.keys(this.projects);
        let showcase = this.projects[keys[ keys.length * Math.random() << 0]];

        let projects = Object.entries(this.projects).map(([k, v]) => {
            if (showcase.url === v.url) {
                console.log('Showcase is:', v);
            }

            return (
                <div className="project" key={ k }>
                    <div className="image-container">
                        <img src={ v.img } alt="project image"/>
                    </div>
                    
                    <a className="project-url" href={ v.url }></a>

                    <div className="image-shadow image-container">
                        <img src={ v.img } alt="project image"/>
                    </div>

                    <div className="project-title">{ k }</div>
                </div>
            );
        });

        return (
            <>
                <header>Projects<br/>0x20f</header>
                { projects }
            </>
        )
    }
}