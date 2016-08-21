/* global google */

import React from 'react';
import ReactDOM from 'react-dom';
import ValidatedGeocomplete from '../../src/ValidatedGeocomplete';

var App = React.createClass({ // eslint-disable-line
  /**
   * Render the example app
   * @return {Function} React render function
   */
  render: function() {
    var fixtures = [
      {label: 'New York', location: {lat: 40.7033127, lng: -73.979681}},
      {label: 'Rio', location: {lat: -22.066452, lng: -42.9232368}},
      {label: 'Tokyo', location: {lat: 35.673343, lng: 139.710388}}
    ];
    const requiredErrorComponent = () => <div className="derp">It is required</div>,
      notFoundErrorComponent = props => <div className="derp">Could not find {props.userInput}</div>;
    return ( // eslint-disable-line
      <div>
        <ValidatedGeocomplete
          requiredErrorComponent={requiredErrorComponent}
          notFoundErrorComponent={notFoundErrorComponent}
          fixtures={fixtures}
          onFocus={this.onFocus}
          onActivateSuggest={this.onActivateSuggest}
          onBlur={this.onBlur}
          onChange={this.onChange}
          autoActivateFirstSuggest={true}
          onSuggestSelect={this.onSuggestSelect}
          onSuggestNoResults={this.onSuggestNoResults}
          location={new google.maps.LatLng(53.558572, 9.9278215)}
          radius="20" />
      </div>
    );
  },

  /**
   * When the input receives focus
   */
  onFocus: function() {
    console.log('onFocus'); // eslint-disable-line
  },

  onActivateSuggest: function(value) {
    console.log('onActivateSuggest', value);
  },

  /**
   * When the input loses focus
   * @param {String} value The user input
   */
  onBlur: function(value) {
    console.log('onBlur', value); // eslint-disable-line
  },

  /**
   * When the input got changed
   * @param {String} value The new value
   */
  onChange: function(value) {
    console.log('input changes to :' + value); // eslint-disable-line
  },

  /**
   * When a suggest got selected
   * @param  {Object} suggest The suggest
   */
  onSuggestSelect: function(suggest) {
    console.log(suggest); // eslint-disable-line
  },

  /**
   * When there are no suggest results
   * @param {String} userInput The user input
   */
  onSuggestNoResults: function(userInput) {
    console.log('onSuggestNoResults for :' + userInput); // eslint-disable-line
  }
});

ReactDOM.render(<App />, document.getElementById('app')); // eslint-disable-line
