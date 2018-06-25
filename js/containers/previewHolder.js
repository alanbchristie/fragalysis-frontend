/**
 * Created by abradley on 14/04/2018.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Grid, Well } from 'react-bootstrap';
import NGLView from '../components/nglComponents';
import MolGroupList from '../components/molGroupList';
import MoleculeList from '../components/moleculeList';
import MolGroupSlider from '../components/molGroupSlider'
import SummaryView from '../components/summaryView';
import * as apiActions from '../actions/apiActions';

class Preview extends Component {

    constructor(props) {
        super(props)
  }
    

    componentDidMount(){
           var target = this.props.match.params.target;
           // Get from the REST API
           fetch(window.location.protocol + "//" + window.location.host+"/api/targets/?tittle="+target)
               .then(response => response.json())
               // Set the target id from the josn
               .then(json => this.props.setTargetOn(json["results"][0].id));
       }
  render() {
      return (
          <Row >
              <Col xs={0} md={0}>
                  <MolGroupList />
              </Col>
              <Col xs={3} md={3}>
                  <NGLView div_id="summary_view" height="200px"/>
                  <MolGroupSlider />
                  <MoleculeList style={{overflow:scroll}}/>
              </Col>
              <Col xs={5} md={5} >
                  <NGLView div_id="major_view" height="600px"/>
              </Col>
              <Col xs={4} md={4}>
                  <SummaryView />
              </Col>
          </Row>
      )
    }

}

function mapStateToProps(state) {
  return { }
}
const mapDispatchToProps = {
    setTargetOn: apiActions.setTargetOn
}


export default connect(mapStateToProps, mapDispatchToProps)(Preview)