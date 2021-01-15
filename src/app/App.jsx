import React, {Component} from 'react';
import { data } from './data';



export default class App extends Component {
    constructor(props) {
        super(props);

        this.projects = data;
        this.holding = false;

        this.state = {
            x: 100,
            y: 100
        }

        this.prevX = 0;
        this.prevY = 0;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.down);
        document.addEventListener('touchstart', this.down);

        document.addEventListener('mousemove', this.move);
        document.addEventListener('touchmove', this.move);

        document.addEventListener('mouseup', this.up);
        document.addEventListener('touchend', this.up);
    }

    up = e => {
        this.holding = false;
    }

    down = e => {
        this.holding = true;
    }

    move = e => {
        if (! this.holding) {
            this.prevX = e.x;
            this.prevY = e.y;
            return;
        }

        const { x, y } = this.state;

        let diffX = e.x - this.prevX;
        let diffY = e.y - this.prevY;

        this.setState({
            x: x + diffX,
            y: y + diffY
        });

        this.prevX = e.x;
        this.prevY = e.y;
    }

    render() {
        let projects = Object.entries(this.projects).map(([k, v]) => {
            let classes = ['project'];

            if (v.showcase) {
                classes.push('showcase');
            }

            return (
                <div className={ classes.join(' ') } key={ k }>
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

        let style = {
            top: `${this.state.y}px`,
            left: `${this.state.x}px`
        }

        return (
            <div className="container" style={ style }>
                { projects }
            </div>
        )
    }
}