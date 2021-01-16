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
            infoShown: true,

            // Whether to show the sidebar
            descriptionVisible: false,
            // What's in the sidebar
            describedProject: {}
        }

        this.prevX = 0;
        this.prevY = 0;

        this.showTimeout;
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

        if (window.localStorage.tipped) {
            return;
        }

        this.showTimeout = setTimeout(() => {
            this.setState({ infoShown: false });
        }, 2000);

        setTimeout(() => {
            this.setState({ infoShown: true });
            window.localStorage.tipped = true;
        }, 10000);
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

        // If the camera moves, the user understood
        if (!this.state.infoShown) {
            this.setState({
                infoShown: true
            });
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

        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
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
                </div>

                <div className={ this.state.infoShown ? 'tips hidden' : 'tips' }>
                    <div className="info">i</div>
                    Click and Drag to move through projects!
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
                        <a className="image-url" href={ detailed.img_author }>Image <br/> Source</a>
                    </div>
                </div>
            </>
        )
    }
}