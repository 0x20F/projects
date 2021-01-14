import React, {Component} from 'react';
import { data } from './data';



export default class App extends Component {
    constructor(props) {
        super(props);

        this.projects = data;
    }

    render() {
        let projects = Object.entries(this.projects).map(([k, v]) => {
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
                { projects }
            </>
        )
    }
}