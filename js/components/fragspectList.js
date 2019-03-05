/**
 * Created by ricgillams on 04/02/2019.
 */
import {Well, Col, Row, ToggleButtonGroup, ToggleButton} from "react-bootstrap";
import {GenericList} from "./generalComponents";
import React from "react";
import {connect} from "react-redux";
import * as apiActions from "../actions/apiActions";
import * as listType from "./listTypes";
import FragspectView from "./fragspectView";
import {withRouter} from "react-router-dom";

// const customStyles = {
//     divider: {
//         background: '#e0e0e0',
//         width: '1px',
//         content: '',
//         display: 'block',
//         position: 'absolute',
//         minHeight: '70px'
//     }
// }

class FragspectList extends GenericList {

    constructor(props) {
        super(props);
        this.list_type = listType.MOLECULE;
        this.fetchEvents = this.fetchEvents.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.showAll = this.showAll.bind(this);
        this.showSome = this.showSome.bind(this);
        this.hideAll = this.hideAll.bind(this);
        this.confFilterChange = this.confFilterChange.bind(this);
        this.depoFilterChange = this.depoFilterChange.bind(this);
        this.siteFilterChange = this.siteFilterChange.bind(this);
        this.interestFilterChange = this.interestFilterChange.bind(this);
        this.siteButtonGenerator = this.siteButtonGenerator.bind(this);
        this.buttonRender = this.buttonRender.bind(this);
        this.initialiseButtons = this.initialiseButtons.bind(this);
        this.state = {
            target: undefined,
            view: "Event Review",
            crystalList: [],
            crystalDict: [],
            maximumSiteNumber: 0,
            buttonList: [],
            depositionFilter: [1,2,3,4,5,6,7],
            confidenceFilter: [1,2,3],
            interestFilter: [0,1],
            siteFilter: [],
            buttonsDepressed: [1001, 1011, 1021, 1031, 1041],
            "siteList": {},
            "confidenceStatus": {
                // "0 - No Ligand placed": 0,
                "Low": 1 ,
                "Medium": 2,
                "High": 3,
                // 4: "Not viewed",
                // 5: "Interesting",
                // 6: "Discard"
                },
            "depositionStatus": {
                1: "Analysis Pending",
                2: "PanDDA Model",
                3: "In Refinement",
                4: "CompChem Ready",
                5: "Deposition Ready",
                6: "Deposited",
                7: "Analysed and Rejected"
            },
            "interestStatus": {
                0: "Not interesting",
                1: "Interesting"
            },
            fragspectObjects: [
                {
                    "id": 49,
                    "crystal": "NUDT21A-x0266",
                    "site_number": 1,
                    "event_number": 1,
                    "code": "NUDT21A-x0266_1",
                    "lig_id": "LIG-D1",
                    "target_name": "NUDT21A",
                    "target_id": 6,
                    "prot_id": 8657,
                    "prot_url": "media/pdbs/NUDT21A-x0266_1_apo.pdb",
                    "event_map_info": "media/maps/NUDT21A-x0266_1_pandda.map",
                    "sigmaa_map_info": "media/maps/NUDT5A-x0349_acceptor_ebBZqDc.ccp4",
                    "spider_plot_info": "media/spideys/NUDT5A-x0349_acceptor_ebBZqDc.png",
                    "two_d_density_map": "media/spideys/NUDT5A-x0349_acceptor_ebBZqDc.png",
                    "pandda_model_found": true,
                    "crystal_status": "1",
                    "event_status": 1,
                    "confidence": 3,
                    "event_resolution": 2.1,
                    "crystal_resolution": 2.1,
                    "smiles": "O=C(O)c1ccc(Cl)c(Cl)c1",
                    "spacegroup": "P 3 2 1",
                    "cell": "125 125 41 90 90 120",
                    "event_comment": "Fragspect is amazing.",
                    "interesting": false
                },
                {
                    "id": 48,
                    "crystal": "DCP2B-x0016",
                    "site_number": 1,
                    "event_number": 1,
                    "code": "DCP2B-x0016_1",
                    "lig_id": "EDO",
                    "target_name": "DCP2B",
                    "target_id": 1,
                    "prot_id": 4654,
                    "prot_url": "media/pdbs/DCP2B-x0016_1_apo_dU9LpzY.pdb",
                    "event_map_info": "media/maps/DCP2B-x0016_1_pandda.map_sjD2vVe.gz",
                    "sigmaa_map_info": "media/maps/NUDT5A-x0349_acceptor_ebBZqDc.ccp4",
                    "spider_plot_info": "media/spideys/NUDT5A-x0349_acceptor_ebBZqDc.png",
                    "two_d_density_map": "media/spideys/NUDT5A-x0349_acceptor_ebBZqDc.png",
                    "pandda_model_found": true,
                    "crystal_status": "4",
                    "event_status": 4,
                    "confidence": 2,
                    "event_resolution": 2.2,
                    "crystal_resolution": 2.2,
                    "smiles": "O=C(O)c1ccc(Cl)c(Cl)c1",
                    "spacegroup": "P 1",
                    "cell": "140 95 41 90 90 120",
                    "event_comment": "Funky naming.",
                    "interesting": true
                },
                {
                    "frag_id": 50,
                    "crystal": "NUDT7A-x2415",
                    "site_number": 6,
                    "event_number": 1,
                    "code": "NUDT7A-x1232_1",
                    "lig_id": "LIG-D1",
                    "target_name": "NUDT7A",
                    "target_id": 5,
                    "prot_id": 8652,
                    "prot_url": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.pdb",
                    "event_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "sigmaa_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "spider_plot_info": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "two_d_density_map": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "pandda_model_found": true,
                    "crystal_status": "5",
                    "event_status": 2,
                    "confidence": 2,
                    "event_resolution": 1.5,
                    "crystal_resolution": 1.4,
                    "smiles": "O=C(Nc1cccnc1)c1ccccc1F",
                    "spacegroup": "P 1",
                    "cell": "48 59 79 79 82 76",
                    "event_comment": "This is magnificent.",
                    "interesting": true
                },
                {
                    "id": 51,
                    "crystal": "NUDT7A-x2415",
                    "site_number": 1,
                    "event_number": 1,
                    "code": "NUDT7A-x0142_2",
                    "lig_id": "LIG-E1",
                    "target_name": "NUDT7A",
                    "target_id": 5,
                    "prot_id": 8651,
                    "prot_url": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.pdb",
                    "event_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "sigmaa_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "spider_plot_info": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "two_d_density_map": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "pandda_model_found": true,
                    "crystal_status": "3",
                    "event_status": 3,
                    "confidence": 1,
                    "event_resolution": 1.4,
                    "crystal_resolution": 1.4,
                    "smiles": "COc1ccc(CC(=O)Nc2cccc(Cl)c2)cc1",
                    "spacegroup": "P 1",
                    "cell": "49 59 80 79 81 75",
                    "event_comment": "Fragspect rocks.",
                    "interesting": true
                },
                {
                    "id": 52,
                    "crystal": "NUDT7A-x2415",
                    "site_number": 2,
                    "event_number": 1,
                    "code": "NUDT7A-x2415_3",
                    "lig_id": "LIG-E1",
                    "target_name": "NUDT7A",
                    "target_id": 5,
                    "prot_id": 8657,
                    "prot_url": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.pdb",
                    "event_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "sigmaa_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "spider_plot_info": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "two_d_density_map": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "pandda_model_found": true,
                    "crystal_status": "2",
                    "event_status": 4,
                    "confidence": 3,
                    "event_resolution": 1.8,
                    "crystal_resolution": 1.4,
                    "smiles":"O=C(O)c1ccc(Br)nc1",
                    "spacegroup": "C 1 2 1",
                    "cell": "102 45 60 90 90 90",
                    "event_comment": "Ric for president.",
                    "interesting": true
                },
                {
                    "id": 53,
                    "crystal": "NUDT7A-x1647",
                    "site_number": 3,
                    "event_number": 1,
                    "code": "NUDT7A-x1647_1",
                    "lig_id": "LIG-D1",
                    "target_name": "NUDT7A",
                    "target_id": 5,
                    "prot_id": 8658,
                    "prot_url": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.pdb",
                    "event_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "sigmaa_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "spider_plot_info": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "two_d_density_map": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "pandda_model_found": true,
                    "crystal_status": "4",
                    "event_status": 5,
                    "confidence": 2,
                    "event_resolution": 2.2,
                    "crystal_resolution": 2.2,
                    "smiles": "Cc1cc(NC(=O)Cc2cccc(O)c2)no1",
                    "spacegroup": "P 1",
                    "cell": "49 59 79 79 81 75",
                    "event_comment": "This is magnificent.",
                    "interesting": true
                },
                {
                    "id": 54,
                    "crystal": "NUDT7A-x0245",
                    "site_number": 1,
                    "event_number": 1,
                    "code": "NUDT7A-x0245_3",
                    "lig_id": "LIG-D1",
                    "target_name": "NUDT7A",
                    "target_id": 5,
                    "prot_id": 8752,
                    "prot_url": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.pdb",
                    "event_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "sigmaa_map_info": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.ccp4",
                    "spider_plot_info": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "two_d_density_map": "media/spideys/NUDT7A-x0349_acceptor_ebBZqDc.png",
                    "pandda_model_found": true,
                    "crystal_status": "7",
                    "event_status": 6,
                    "confidence": 3,
                    "event_resolution": 1.8,
                    "crystal_resolution": 1.8,
                    "smiles": "O=C(Nc1ccon1)c1ccccc1F",
                    "spacegroup": "P 3 2 1",
                    "cell": "125 125 41 90 90 120",
                    "event_comment": "This is magnificent.",
                    "interesting": true
                },
                {
                    "id": 55,
                    "crystal": "NUDT5A-x0526",
                    "site_number": 4,
                    "event_number": 1,
                    "code": "NUDT5A-x0526_3",
                    "lig_id": "LIG-E1",
                    "target_name": "NUDT5A",
                    "target_id": 6,
                    "prot_id": 8655,
                    "prot_url": "media/maps/NUDT7A-x0349_acceptor_ebBZqDc.pdb",
                    "event_map_info": "media/maps/NUDT5A-x0349_acceptor_ebBZqDc.ccp4",
                    "sigmaa_map_info": "media/maps/NUDT5A-x0349_acceptor_ebBZqDc.ccp4",
                    "spider_plot_info": "media/spideys/NUDT5A-x0349_acceptor_ebBZqDc.png",
                    "two_d_density_map": "media/spideys/NUDT5A-x0349_acceptor_ebBZqDc.png",
                    "pandda_model_found": true,
                    "crystal_status": "6",
                    "event_status": 7,
                    "confidence": 3,
                    "event_resolution": 2.5,
                    "crystal_resolution": 2.5,
                    "smiles": "Cc1cc(NC(=O)Cc2cccc(O)c2)no1",
                    "spacegroup": "C 1 2 1",
                    "cell": "102, 45, 60 90 90 90",
                    "event_comment": "This is magnificent.",
                    "interesting": false
                }
            ]
        };
    }

    // updateTarget(){
    //     var target = this.props.match.params.target;
    //     // Get from the REST API
    //     // if (this.props.targetIdList.length != 0) {
    //     //     var targetUnrecognised = true;
    //     //     for (var i in this.props.targetIdList) {
    //     //         if (target == this.props.targetIdList[i].title) {
    //     //             targetUnrecognised = false;
    //     //         }
    //     //     }
    //     // }
    //     // this.props.setTargetUnrecognised(targetUnrecognised);
    //     fetch(window.location.protocol + "//" + window.location.host+"/xcdb/fragspect/?crystal__target__target_name__iexact="+target)
    //         .then(response => response.json())
    //         .then(json => this.setTarget(json))
    //         .catch((error) => {
    //                 // this.deployErrorModal(error);
    //             })
    // }

    // setTarget(json) {
    //     if (json.count == 0) {
    //         console.log("no events for this target found")
    //     } else {
    //         this.props.setFragspectTarget(json["results"][0].target_name);
    //     }
    // }

    fetchEvents(){
        var target = this.props.match.params.target;
        fetch(window.location.protocol + "//" + window.location.host+"/xcdb/fragspect/?crystal__target__target_name__iexact="+target)
            .then(response => response.json())
            .then(json => this.setEvents(json))
            // .then(this.initialiseButtons(json.results))
            .catch((error) => {
                    // this.deployErrorModal(error);
                })
    }

    setEvents(json){
        this.props.setFragspectTarget(json["results"][0].target_name);
        this.setState(prevState => ({fragspectObjects: json.results}));
        this.props.setFragspectEvents(json.results);
        this.initialiseButtons(json.results)
        // component.forceUpdate();
    }

    handleFilterChange(value) {
        var oldBDState = this.state.buttonsDepressed;
        var removed = oldBDState.filter(function(i) {return value.indexOf(i)<0;})[0]
        var added = value.filter(function(i) {return oldBDState.indexOf(i)<0;})[0]
        if (added == undefined) {
            if (removed > 1000) {
            } else if (removed <= 7) {
                this.depoFilterChange(removed);
            } else if (removed <= 10) {
                this.confFilterChange(removed);
            } else if (removed <= 12) {
                this.interestFilterChange(removed);
            } else {
                this.siteFilterChange(removed);
            }
        } else {
            if (added >1010) {
                if (added == 1011){this.showAll("site", 12, added)}
                else if (added == 1012){this.hideAll("site", 12, added)}
                else if (added == 1021){this.showAll("deposition", 0, added)}
                else if (added == 1022){this.hideAll("deposition", 0, added)}
                else if (added == 1023){this.showSome("deposition", {4: "CCR", 5: "DR", 6: "D"}, {1: "AP", 2: "PM", 3: "IR", 7: "AnR"}, 0, added)}
                else if (added == 1031){this.showAll("confidence", 7, added)}
                else if (added == 1032){this.hideAll("confidence", 7, added)}
                else if (added == 1041){this.showAll("interest", 11, added)}
                else if (added == 1042){this.hideAll("interest", 11, added)}
            } else if (added > 1000) {
                if (added == 1001) {
                    this.setState(prevState => ({view: "Event Review"}));
                    var newButtonsDepressed = this.state.buttonsDepressed.filter(butt => butt != 1002);
                    this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
                } else if (added == 1002) {
                    this.setState(prevState => ({view: "Deposition Review"}));
                    var newButtonsDepressed = this.state.buttonsDepressed.filter(butt => butt != 1001);
                    this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
                }
                newButtonsDepressed.push(added);
                this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
            } else if (added <= 7) {
                this.depoFilterChange(added);
            } else if (added <= 10) {
                this.confFilterChange(added);
            } else if (added <= 12) {
                this.interestFilterChange(added);
            } else {
                this.siteFilterChange(added);
            }
        }
    }

    showAll(type, offset, trigger){
        if (type == "deposition"){
            var itemList = this.state.depositionStatus;
            // var offset = 0;
            var filter = this.state.depositionFilter.slice();
        } else if (type == "confidence"){
            var itemList = this.state.confidenceStatus;
            // var offset = 7;
            var filter = this.state.confidenceFilter.slice();
        } else if (type == "interest"){
            var itemList = this.state.interestStatus;
            // var offset = 11;
            var filter = this.state.interestFilter.slice();
        }  else if (type == "site") {
            var itemList = this.state.siteList;
            var filter = this.state.siteFilter.slice();
        }
        var newButtonsDepressed = this.state.buttonsDepressed.slice();
        for (var item in itemList) {
            var buttonNumber = parseInt(item) + offset;
            if (filter.includes(parseInt(item)) == false) {
                filter.push(parseInt(item));
            }
            if (newButtonsDepressed.includes(buttonNumber) == false) {
                newButtonsDepressed.push(buttonNumber)
            }
        }
        newButtonsDepressed.push(trigger);
        filter.sort();
        if (type == "site"){
            if (this.state.buttonsDepressed.includes(1012)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1012),1);
            }
            this.setState(prevState => ({siteFilter: filter}))
        } else if (type == "deposition"){
            if (this.state.buttonsDepressed.includes(1022)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1022),1);
            }
            if (this.state.buttonsDepressed.includes(1023)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1023),1);
            }
            this.setState(prevState => ({depositionFilter: filter}))
        } else if (type == "confidence") {
            if (this.state.buttonsDepressed.includes(1032)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1032),1);
            }
            this.setState(prevState => ({confidenceFilter: filter}))
        } else if (type == "interest"){
            if (this.state.buttonsDepressed.includes(1042)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1042),1);
            }
            this.setState(prevState => ({interestFilter: filter}))
        };
        this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
    }

    showSome(type, selectOn, selectOff, offset, trigger){
        if (type == "deposition") {
            var filter = this.state.depositionFilter;
        }
        var newButtonsDepressed = this.state.buttonsDepressed.slice();
        for (var on in selectOn) {
            var buttonNumber = parseInt(on) + offset;
            if (newButtonsDepressed.includes(buttonNumber) == false) {
                newButtonsDepressed.push(buttonNumber)
            }
            if (filter.includes(parseInt(on)) == false) {
                filter.push(parseInt(on));
            }
        }
        for (var off in selectOff) {
            var buttonNumber = parseInt(off) + offset;
            if (newButtonsDepressed.includes(buttonNumber)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(buttonNumber), 1)
            }
            if (filter.includes(parseInt(off))) {
                filter.splice(filter.indexOf(parseInt(off)), 1)
            }
        }
        newButtonsDepressed.push(trigger);
        filter.sort();
        if (type == "deposition"){
            if (this.state.buttonsDepressed.includes(1021)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1021), 1)
            }
            if (this.state.buttonsDepressed.includes(1022)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1022), 1)
            }
            this.setState(prevState => ({depositionFilter: filter}))
        }
        this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
    }

    hideAll(type, offset, trigger){
        if (type == "deposition"){
            var itemList = this.state.depositionStatus;
            var filter = this.state.depositionFilter.slice();
        } else if (type == "confidence"){
            var itemList = this.state.confidenceStatus;
            var filter = this.state.confidenceFilter.slice();
        } else if (type == "interest"){
            var itemList = this.state.interestStatus;
            var filter = this.state.interestFilter.slice();
        }  else if (type == "site") {
            var itemList = this.state.siteList;
            var filter = this.state.siteFilter.slice();
        }
        var newButtonsDepressed = this.state.buttonsDepressed.slice();
        for (var item in itemList) {
            var buttonNumber = parseInt(item) + offset;
            if (newButtonsDepressed.includes(buttonNumber)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(buttonNumber),1);
            }
            if (filter.includes(parseInt(item))) {
                filter.splice(filter.indexOf(parseInt(item)), 1)
            }
        }
        newButtonsDepressed.push(trigger);
        if (type == "site"){
            if (this.state.buttonsDepressed.includes(1011)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1011),1);
            }
            this.setState(prevState => ({siteFilter: filter}))
        } else if (type == "deposition"){
            if (this.state.buttonsDepressed.includes(1021)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1021),1);
            }
            if (this.state.buttonsDepressed.includes(1023)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1023),1);
            }
            this.setState(prevState => ({depositionFilter: filter}))
        } else if (type == "confidence"){
            if (this.state.buttonsDepressed.includes(1031)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1031),1);
            }
            this.setState(prevState => ({confidenceFilter: filter}))
        } else if (type == "interest"){
            if (this.state.buttonsDepressed.includes(1041)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1041),1);
            }
            this.setState(prevState => ({interestFilter: filter}))
        };
        this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
    }

    confFilterChange(value){
        var confValue = value - 7;
        if (this.state.confidenceFilter.includes(confValue)){
            this.setState(prevState => ({confidenceFilter: prevState.confidenceFilter.filter(conf => conf != confValue)}))
            this.setState(prevState => ({buttonsDepressed: prevState.buttonsDepressed.filter(dep => dep != value)}))
            if (this.state.buttonsDepressed.includes(1031)) {
                this.setState(prevState => ({buttonsDepressed: prevState.buttonsDepressed.filter(dep => dep != 1031)}))
            }
        } else {
            var newConfFilter = this.state.confidenceFilter.slice();
            newConfFilter.push(confValue);
            newConfFilter.sort();
            this.setState(prevState => ({confidenceFilter: newConfFilter}));
            var newButtonsDepressed = this.state.buttonsDepressed.slice();
            newButtonsDepressed.push(value);
            if (this.state.buttonsDepressed.includes(1032)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1032), 1)
            }
            newButtonsDepressed.sort();
            this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
        }
    }

    depoFilterChange(value){
        if (this.state.depositionFilter.includes(value)){
            this.setState(prevState => ({depositionFilter: prevState.depositionFilter.filter(depo => depo != value)}))
            this.setState(prevState => ({buttonsDepressed: prevState.buttonsDepressed.filter(dep => dep != value)}))
            if (this.state.buttonsDepressed.includes(1021)) {
                this.setState(prevState => ({buttonsDepressed: prevState.buttonsDepressed.filter(dep => dep != 1021)}))
            }
            if (this.state.buttonsDepressed.includes(1023)) {
                this.setState(prevState => ({buttonsDepressed: prevState.buttonsDepressed.filter(dep => dep != 1023)}))
            }
        } else {
            var newDepoFilter = this.state.depositionFilter.slice();
            newDepoFilter.push(value);
            newDepoFilter.sort();
            this.setState(prevState => ({depositionFilter: newDepoFilter}));
            var newButtonsDepressed = this.state.buttonsDepressed.slice();
            newButtonsDepressed.push(value);
            if (this.state.buttonsDepressed.includes(1022)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1022), 1)
            }
            newButtonsDepressed.sort();
            this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
        }
    }

    siteFilterChange(value){
        var siteValue = value - 12;
        if (this.state.siteFilter.includes(siteValue)) {
            this.setState(prevState => ({siteFilter: prevState.siteFilter.filter(site => site != siteValue)}))
            this.setState(prevState => ({buttonsDepressed: prevState.buttonsDepressed.filter(dep => dep != value)}))
            if (this.state.buttonsDepressed.includes(1011)) {
                this.setState(prevState => ({buttonsDepressed: prevState.buttonsDepressed.filter(dep => dep != 1011)}))
            }
        } else {
            var newSiteFilter = this.state.siteFilter.slice();
            newSiteFilter.push(siteValue);
            newSiteFilter.sort();
            this.setState(prevState => ({siteFilter: newSiteFilter}));
            var newButtonsDepressed = this.state.buttonsDepressed.slice();
            newButtonsDepressed.push(value);
            if (this.state.buttonsDepressed.includes(1012)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1012), 1)
            }
            newButtonsDepressed.sort();
            this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
        }
    }

    interestFilterChange(value){
        var interestValue = value - 11;
        if (this.state.interestFilter.includes(interestValue)){
            this.setState(prevState => ({interestFilter: prevState.interestFilter.filter(int => int != interestValue)}))
            this.setState(prevState => ({buttonsDepressed: prevState.buttonsDepressed.filter(dep => dep != value)}))
            if (this.state.buttonsDepressed.includes(1041)) {
                this.setState(prevState => ({buttonsDepressed: prevState.buttonsDepressed.filter(dep => dep != 1041)}))
            }
        } else {
            var newInterestFilter = this.state.interestFilter.slice();
            newInterestFilter.push(interestValue);
            newInterestFilter.sort();
            this.setState(prevState => ({interestFilter: newInterestFilter}));
            var newButtonsDepressed = this.state.buttonsDepressed.slice();
            newButtonsDepressed.push(value);
            if (this.state.buttonsDepressed.includes(1042)) {
                newButtonsDepressed.splice(newButtonsDepressed.indexOf(1042), 1)
            }
            newButtonsDepressed.sort();
            this.setState(prevState => ({buttonsDepressed: newButtonsDepressed}));
        }
    }

    siteButtonGenerator(){
        var buttons = [];
        for (var i in this.state.siteList){
            buttons.push(this.buttonRender("Site", parseInt(i)+12, parseInt(i)));
        }
        return buttons;
    }

    buttonRender(type, value, status) {
        if (type == "Site") {
            var button = <ToggleButton bsSize="sm" bsStyle="primary" value={value} key={"site"+ value.toString()}>{type}: {status}</ToggleButton>;
        } else if (type == "Deposition") {
            var button = <ToggleButton bsSize="sm" bsStyle="warning" value={value}>{value}: {this.state.depositionStatus[value]}</ToggleButton>;
        } else if (type == "Confidence") {
            var button = <ToggleButton bsSize="sm" bsStyle="info" value={value}>{type}: {this.state.confidenceStatus[status]}</ToggleButton>;
        } else if (type == "Interesting") {
            var button = <ToggleButton bsSize="sm" bsStyle="success" value={value} key={"interesting"+ value.toString()}>{this.state.interestStatus[status]}</ToggleButton>;
        }
        return button;
    }

    generateRows() {
        if (this.state.view == "Event Review") {
            var rows = [];
            for (var event in this.state.fragspectObjects) {
                if (this.state.confidenceFilter.includes(this.state.fragspectObjects[event].confidence) &&
                    this.state.depositionFilter.includes(parseInt(this.state.fragspectObjects[event].crystal_status)) &&
                    this.state.interestFilter.includes(this.state.fragspectObjects[event].interesting == true ? 1 : 0) &&
                    this.state.siteFilter.includes(this.state.fragspectObjects[event].site_number)) {
                    rows.push(<FragspectView key={this.state.fragspectObjects[event].code}
                                             data={this.state.fragspectObjects[event]}/>)
                }
            }
        }
        else {
            var rows = [];
            for (var crystal in this.state.crystalList) {
                rows.push(
                    <Row key={"crystal"+crystal.toString()}>
                        <Col xs={2} md={2}>
                            <h3><b>Crystal: {this.state.crystalList[crystal]}</b></h3>
                        </Col>
                        <Col xs={2} md={2}></Col>
                        <Col xs={2} md={2}>
                            <h4><b>{this.state.crystalDict[crystal].status.toString()}. {this.state.depositionStatus[this.state.crystalDict[crystal].status]}</b></h4>
                        </Col>
                        <Col xs={2} md={2}></Col>
                        <Col xs={1} md={1}>
                            <h4 className="text-center"><b>{this.state.crystalDict[crystal].resolution.toString()} Å</b></h4>
                        </Col>
                        <Col xs={3} md={3}></Col>
                    </Row>
                );
                for (var event in this.state.fragspectObjects) {
                    if (this.state.fragspectObjects[event].crystal == this.state.crystalList[crystal] &&
                        this.state.confidenceFilter.includes(this.state.fragspectObjects[event].confidence) &&
                        this.state.depositionFilter.includes(parseInt(this.state.fragspectObjects[event].event_status)) &&
                        this.state.interestFilter.includes(this.state.fragspectObjects[event].interesting == true ? 1 : 0) &&
                        this.state.siteFilter.includes(this.state.fragspectObjects[event].site_number)) {
                        rows.push(<FragspectView key={this.state.fragspectObjects[event].code}
                                                 data={this.state.fragspectObjects[event]}/>)
                    }
                }
            }
        }
        return rows;
    }

    initialiseButtons(props){
        var siteDict = {};
        var maxSite = 1;
        var crystalList = [];
        var crystalDict = [];
        var buttonList = [1,2,3,4,5,6,7,8,9,10,11,12,1001,1002,1011,1012,1021,1022,1023,1031,1032,1041,1042];
        for (var event in props){
            if (crystalList.includes(props[event].crystal) == false) {
                crystalList.push(props[event].crystal);
                crystalDict.push({
                    "name": props[event].crystal,
                    "resolution": props[event].crystal_resolution,
                    "status": props[event].parseInt(crystal_status)
                })
            }
            siteDict[props[event].site_number] = "Site" + props[event].site_number.toString();
            buttonList.push(props[event].site_number + 12)
            if (props[event].site_number > maxSite) {
                maxSite = props[event].site_number;
            }
        }
        // crystalList.sort();
        this.setState(prevState => ({crystalList: crystalList}));
        this.setState(prevState => ({crystalDict: crystalDict}));
        this.setState(prevState => ({maximumSiteNumber: maxSite}));
        this.setState(prevState => ({siteList: siteDict}));
        var newSiteFilter = this.state.siteFilter.splice();
        for (var i in siteDict) {
            newSiteFilter.push(parseInt(i));
        }
        this.setState(prevState => ({siteFilter: newSiteFilter}));
    }

    componentWillMount(){
        this.fetchEvents()
        // if (this.props.fragspectTarget != undefined) {
        // } else {}
        // var siteDict = {};
        // var maxSite = 1;
        // var crystalList = [];
        // var crystalDict = [];
        // var buttonList = [1,2,3,4,5,6,7,8,9,10,11,12,1001,1002,1011,1012,1021,1022,1023,1031,1032,1041,1042];
        // for (var event in this.props.fragspectEvents){
        //     if (crystalList.includes(this.props.fragspectEvents[event].crystal) == false) {
        //         crystalList.push(this.props.fragspectEvents[event].crystal);
        //         crystalDict.push({
        //             "name": this.props.fragspectEvents[event].crystal,
        //             "resolution": this.props.fragspectEvents[event].crystal_resolution,
        //             "status": this.props.fragspectEvents[event].crystal_status
        //         })
        //     }
        //     siteDict[this.props.fragspectEvents[event].site_number] = "Site" + this.props.fragspectEvents[event].site_number.toString();
        //     buttonList.push(this.props.fragspectEvents[event].site_number + 12)
        //     if (this.props.fragspectEvents[event].site_number > maxSite) {
        //         maxSite = this.props.fragspectEvents[event].site_number;
        //     }
        // }
        // // crystalList.sort();
        // this.setState(prevState => ({crystalList: crystalList}));
        // this.setState(prevState => ({crystalDict: crystalDict}));
        // this.setState(prevState => ({maximumSiteNumber: maxSite}));
        // this.setState(prevState => ({siteList: siteDict}));
        // var newSiteFilter = this.state.siteFilter.splice();
        // for (var i in siteDict) {
        //     newSiteFilter.push(parseInt(i));
        // }
        // this.setState(prevState => ({siteFilter: newSiteFilter}));
    }

    componentDidMount() {
        // if (this.props.match.params.target != undefined) {
        //     var target = this.props.match.params.target;
        //     this.setState(prevState => ({target: target}));
        // }
        //should write something to check if all or none of a certain filter is on and then highlight all or none box
        // this.fetchEvents()
        var filtersOn = [1001, 1011, 1021, 1031, 1041];
        for (var d in this.state.depositionFilter){
            filtersOn.push(this.state.depositionFilter[d]);
        }
        for (var c in this.state.confidenceFilter){
            filtersOn.push(this.state.confidenceFilter[c]+7);
        }
        for (var f in this.state.interestFilter){
            filtersOn.push(this.state.interestFilter[f]+11);
        }
        for (var s in this.state.siteFilter){
            filtersOn.push(this.state.siteFilter[s]+12);
        }
        this.setState(prevState => ({buttonsDepressed: filtersOn}));
    }

    componentDidUpdate(){
        if (this.props.fragspectTarget != undefined) {
            document.title = this.props.fragspectTarget + ": Fragspect"
        }
    }

    // componentWillReceiveProps(nextProps){
    //     // this.fetchEvents();
    //     this.initialiseButtons(nextProps);
    //     console.log("new events")
    // }

    render() {
        return <Well>
            <Row height="50px" style={{overflow: scroll}}>
                <Row>
                    <h2 className="text-center">{"Fragspect: " + this.props.fragspectTarget}</h2>
                    <Col xs={2} md={2}>
                        <Col xs={3} md={3}></Col>
                        <Col xs={8} md={8}><h4 className="text-center">Site selector</h4></Col>
                        <Col xs={1} md={1}></Col>
                    </Col>
                    <Col xs={4} md={4}><h4 className="text-center">Status filter</h4></Col>
                    <Col xs={2} md={2}>
                        <Col xs={3} md={3}></Col>
                        <Col xs={8} md={8}><h4 className="text-center">Confidence filter</h4></Col>
                        <Col xs={1} md={1}></Col>
                    </Col>
                    <Col xs={2} md={2}>
                        <Col xs={2} md={2}></Col>
                        <Col xs={8} md={8}><h4 className="text-center">Interesting</h4></Col>
                        <Col xs={2} md={2}></Col>
                    </Col>
                    <Col xs={2} md={2}>
                        <Col xs={1} md={1}></Col>
                        <Col xs={8} md={8}><h4 className="text-center">View</h4></Col>
                        <Col xs={3} md={3}></Col>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2} md={2}>
                        <Col xs={3} md={3}></Col>
                        <Col xs={8} md={8}>
                            <div className="text-center">
                                <ToggleButtonGroup type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                    <ToggleButton bsSize="sm" bsStyle="primary" value={1011}>Show all</ToggleButton>
                                    <ToggleButton bsSize="sm" bsStyle="primary" value={1012}>Hide all</ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </Col>
                        <Col xs={1} md={1}></Col>
                    </Col>
                    <Col xs={4} md={4}>
                        <Col xs={1} md={1}></Col>
                        <Col xs={4} md={10}>
                            <div className="text-center">
                                <ToggleButtonGroup type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                    <ToggleButton bsSize="sm" bsStyle="warning" value={1021}>Show all</ToggleButton>
                                    <ToggleButton bsSize="sm" bsStyle="warning" value={1023}>Show Comp. Chem. and above</ToggleButton>
                                    <ToggleButton bsSize="sm" bsStyle="warning" value={1022}>Hide all</ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </Col>
                        <Col xs={1} md={1}></Col>
                    </Col>
                    <Col xs={2} md={2}>
                        <Col xs={3} md={3}></Col>
                        <Col xs={8} md={8}>
                            <div className="text-center">
                                <ToggleButtonGroup type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                    <ToggleButton bsSize="sm" bsStyle="info" value={1031}>Show all</ToggleButton>
                                    <ToggleButton bsSize="sm" bsStyle="info" value={1032}>Hide all</ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </Col>
                        <Col xs={1} md={1}></Col>
                    </Col>
                    <Col xs={2} md={2}>
                        <Col xs={2} md={2}></Col>
                        <Col xs={8} md={8}>
                            <div className="text-center">
                                <ToggleButtonGroup type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                    <ToggleButton bsSize="sm" bsStyle="success" value={1041}>Show all</ToggleButton>
                                    <ToggleButton bsSize="sm" bsStyle="success" value={1042}>Hide all</ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </Col>
                        <Col xs={2} md={2}></Col>
                    </Col>
                    <Col xs={2} md={2}></Col>
                </Row>
                <Row><p> </p></Row>
                <Row>
                    <Col xs={2} md={2}>
                        <Col xs={3} md={3}></Col>
                        <Col xs={8} md={8}>
                            <ToggleButtonGroup vertical block type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                {this.siteButtonGenerator()}
                                <p className="text-center">Site filter: {this.state.siteFilter.toString()}</p>
                            </ToggleButtonGroup>
                        </Col>
                        <Col xs={1} md={1}></Col>
                    </Col>
                    <Col xs={4} md={4}>
                        <Col xs={6} md={6}>
                            <ToggleButtonGroup vertical block type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                {this.buttonRender("Deposition", 1, "Analysis Pending")}
                                {this.buttonRender("Deposition", 2, "PanDDA Model")}
                                {this.buttonRender("Deposition", 3, "In Refinement")}
                                <p className="text-center">Deposition filter: {this.state.depositionFilter.toString()}</p>
                            </ToggleButtonGroup>
                        </Col>
                        <Col xs={6} md={6}>
                            <ToggleButtonGroup vertical block type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                {this.buttonRender("Deposition", 4, "CompChem Ready")}
                                {this.buttonRender("Deposition", 5, "Deposition Ready")}
                                {this.buttonRender("Deposition", 6, "Deposited")}
                                {this.buttonRender("Deposition", 7, "Analysed and Rejected")}
                            </ToggleButtonGroup>
                        </Col>
                    </Col>
                    <Col xs={2} md={2}>
                        <Col xs={3} md={3}></Col>
                        <Col xs={8} md={8}>
                            <ToggleButtonGroup vertical block type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                {this.buttonRender("Confidence", 8, 1)}
                                {this.buttonRender("Confidence", 9, 2)}
                                {this.buttonRender("Confidence", 10, 3)}
                                <p className="text-center">Confidence filter: {this.state.confidenceFilter.toString()}</p>
                            </ToggleButtonGroup>
                        </Col>
                        <Col xs={1} md={1}></Col>
                    </Col>
                    <Col xs={2} md={2}>
                        <Col xs={2} md={2}></Col>
                        <Col xs={8} md={8}>
                            <ToggleButtonGroup vertical block type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                {this.buttonRender("Interesting", 11, 0)}
                                {this.buttonRender("Interesting", 12, 1)}
                                <p className="text-center">Interest filter: {this.state.interestFilter.toString()}</p>
                            </ToggleButtonGroup>
                        </Col>
                        <Col xs={2} md={2}></Col>
                    </Col>
                    <Col xs={2} md={2}>
                        <Col xs={1} md={1}></Col>
                        <Col xs={8} md={8}>
                            <ToggleButtonGroup vertical block type="checkbox" value={this.state.buttonsDepressed} onChange={this.handleFilterChange}>
                                <ToggleButton bsSize="sm" bsStyle="default" value={1001} key={"view:eventReview"}>Event Review</ToggleButton>
                                <ToggleButton bsSize="sm" bsStyle="default" value={1002} key={"view:depositionReview"}>Deposition Review</ToggleButton>
                            </ToggleButtonGroup>
                        </Col>
                        <Col xs={3} md={3}></Col>
                    </Col>
                </Row>
            </Row>
            {/*<Row style={customStyles}></Row>*/}
            <Row>
                <Col xs={1} md={1}><h4 className="text-center">Crystal ID</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Site</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Ligand ID</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Structure</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Status</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Confidence</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Density</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Spider</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Resolution</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">SPG and cell</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Comments</h4></Col>
                <Col xs={1} md={1}><h4 className="text-center">Interesting?</h4></Col>
            </Row>
            {this.generateRows()}
        </Well>;
    }
}
function mapStateToProps(state) {
    return {
        // object_list: state.apiReducers.present.molecule_list,
        fragspectTarget: state.apiReducers.present.fragspectTarget,
        fragspectEvents: state.apiReducers.present.fragspectEvents
    }
}
const mapDispatchToProps = {
    // setObjectList: apiActions.setMoleculeList,
    setFragspectTarget: apiActions.setFragspectTarget,
    setFragspectEvents: apiActions.setFragspectEvents,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FragspectList));
