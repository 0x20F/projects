import React, {Component} from 'react';
import { data } from './data';



export default class App extends Component {
    constructor(props) {
        super(props);

        this.projects = data;
        this.holding = false;

        this.state = {
            x: -200,
            y: -500,

            // Whether to show the sidebar
            descriptionVisible: false,
            // What's in the sidebar
            describedProject: {}
        }

        this.prevX = 0;
        this.prevY = 0;

        this.containerRef = React.createRef();
        this.projectRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.down);
        document.addEventListener('touchstart', this.down);

        document.addEventListener('mousemove', this.move);
        document.addEventListener('touchmove', this.move);

        document.addEventListener('mouseup', this.up);
        document.addEventListener('touchend', this.up);

        let container = this.containerRef.current;
        let project = this.projectRef.current;

        const { offsetHeight } = container;

        this.setState({
            x: (window.innerWidth / 2) - (project.offsetWidth / 2),
            y: -(offsetHeight - (window.innerHeight / 2)) + (project.offsetHeight / 2)
        });
    }

    up = e => {
        this.holding = false;
    }

    down = e => {
        let x, y;
        
        if (e.type === 'touchstart') {
            let touch = e.touches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type === 'mousedown') {
            x = e.pageX;
            y = e.pageY;
        }

        this.prevX = x;
        this.prevY = y;
        
        this.holding = true;
    }

    move = e => {
        let x, y;

        if (e.type === 'touchmove') {
            let touch = e.touches[0];
            x = touch.pageX;
            y = touch.pageY;
        } else if (e.type === 'mousemove') {
            x = e.pageX;
            y = e.pageY;
        }

        if (! this.holding) {
            return;
        }

        // If the camera moves, hide the description
        if (this.state.descriptionVisible) {
            this.setState({
                descriptionVisible: false
            });

            setTimeout(() => {
                this.setState({
                    describedProject: {}
                });
            }, 100);
        }

        let diffX = x - this.prevX;
        let diffY = y - this.prevY;

        this.setState({
            x: this.state.x + diffX,
            y: this.state.y + diffY
        });

        this.prevX = x;
        this.prevY = y;
    }


    showDescription = (title, project) => {
        project.title = title;

        if (project.title === this.state.describedProject.title) {
            return;
        } 

        this.setState({
            descriptionVisible: false
        }, () => {
            setTimeout(() => {
                this.setState({
                    descriptionVisible: true,
                    describedProject: project
                });
            }, 100);
        });
    }


    render() {
        let projects = Object.entries(this.projects).map(([k, v], i) => {
            let classes = ['project'];

            if (v.showcase) {
                classes.push('showcase');
            }

            return (
                <div 
                    ref={ i === 1 ? this.projectRef : null } 
                    className={ classes.join(' ') } 
                    key={ k }
                    onClick={ () => this.showDescription(k, v) }
                    >
                    <div className="image-container">
                        <img src={ v.img } alt="project image"/>
                    </div>

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

        let detailed = this.state.describedProject;

        return (
            <>
                <div ref={ this.containerRef } className="container" style={ style }>
                    { projects }
                    <div className="instructions">
                        <svg version="1.1" width="34" height="34" viewBox="0 0 34 34"><path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" /></svg>
                        Click and drag to look around!
                    </div>
                </div>

                <div className={ this.state.descriptionVisible ? 'project-details' : 'project-details hidden' }>
                    <div className="project-details-image">
                        <img src={ detailed.img } alt="project image"/>
                        { /*<span className="image-author">image by Koyorin</span> */ }
                    </div>

                    <div className="project-details-text">
                        <div className="title">{ detailed.title }</div>
                        <div className="description">{ detailed.description || 'No description yet.' }</div>
                    </div>

                    <div className="project-details-buttons">
                        <a className="project-url" href={ detailed.url }>Source</a>
                        { detailed.img_author && <a className="image-url" href={ detailed.img_author }>Image <br/> Source</a> }
                    </div>
                </div>
            </>
        )
    }
}