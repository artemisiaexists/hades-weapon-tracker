import React from "react";
import './main.css';
const Weapon = (props) => {
    const weapon = props.i;
    const progress = [props.progress[0], props.progress[1], props.progress[2]]
    const numColor = (-255/59)*parseInt(props.heat) + 255;
    const disableNewlines = (event) => {
        const keyCode = event.keyCode || event.which
        if (keyCode === 13) {
            event.returnValue = false
            if (event.preventDefault) event.preventDefault()
            for(let i = 2; i < 6; i++) {
                event.target.parentNode.parentNode.children[i].children[0].checked = false
            }
            props.enter(event.target.innerText, weapon, event.target.className.split(" ")[1])
        }
    }
    return(
        <tr>
            <td key = {5} className="weaponimgcont"><div className="weaponimgcell"><a href = {props.url} target="_blank" rel="noreferrer"><img src={require(`./imgs/${props.name}.png`)} className="weaponimgs" alt = {props.name}/></a></div></td>
            <td key = {6} style={{color: `rgb(255, ${numColor}, 0)`}}><span className="form" role="textbox" contentEditable={true} onKeyPress={disableNewlines}>{props.heat}</span></td>
            {progress.map((level, i) => { if(level) {console.log(level + " it knows the toggle state");return(<td key = {i}><input type="checkbox" className="checkbox" onChange={props.change} checked/></td>)} else { return(<td key = {i}><input type="checkbox" id = {`${weapon} ${i}`} className="checkbox" onChange={props.change}/></td>)}})}
            <td key = {3}><input type="checkbox" id = {`${weapon} 3`} className="checkbox" onChange={props.change}/></td>
        </tr>
    )
}

const App = () => {
    const [data, setData] = React.useState([]);
    const levels = ["tartarus", "asphodel", "elysium", "styx"];
    React.useEffect(() => {
        fetch("https://gabby-principled-red.glitch.me/weapons")
        .then(res => res.json())
        .then(json => setData(json.weapons));
    }, []);
    const changeValue = (event) => {
        const weapon = event.target.id.split(" ")[0];
        const level = event.target.id.split(" ")[1];
        if(parseInt(level) === 3) {
            for(let i = 2; i < 6; i++) {
                event.target.parentNode.parentNode.children[i].children[0].checked = false
            }
        }
        fetch("https://gabby-principled-red.glitch.me/weapons", {
            method: "post",
            headers: {
                "weapon": weapon,
                "level": level, 
                "heat": -1
            },
        })
            .then(res => res.json())
            .then(json => setData(json.weapons))
    }
    function enterValue(newHeat, weapon, level) {
        fetch("https://gabby-principled-red.glitch.me/weapons", {
            method: "post",
            headers: {
                "weapon": weapon,
                "level": level, 
                "heat": newHeat
            },
        })
            .then(res => res.json())
            .then(json => setData(json.weapons))
    }
    return (
        <div id="container">
            <p style={{textAlign: "center", width: "425px"}}>Weapon Heat Tracker</p>
            <table>
                <thead>
                    <tr>
                        <th key ={6}></th>
                        <th key ={5}><img src={require(`./imgs/heat.png`)} id="heatimg" alt = "heat"/></th>
                        {levels.map((level, i) => {return(<th key ={i}><img src={require(`./imgs/${i}.png`)} className="levelimgs" alt = {level}/></th>)})}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item,i) => {return(<Weapon i = {i} key = {i} name = {item.name} heat = {item.heat} progress = {item.progress} change = {changeValue} enter = {enterValue} url = {item.url}/>)})}
                </tbody>
            </table>
        </div>
    );
}

export default App;
