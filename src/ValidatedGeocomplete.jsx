import defaults from './defaults';
import propTypes from './prop-types';
import React from 'react';
import BaseGeocomplete from './BaseGeocomplete';

class ValidatedGeocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validationState: 'initial'
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.inputMatchesAutocomplete = this.inputMatchesAutocomplete.bind(this);
    this.renderValidationErrors = this.renderValidationErrors.bind(this);
    this.validate = this.validate.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  get value() {
    return this.refs.geocompleteBase.value;
  }

  componentWillMount() {
    var googleMaps = this.props.googleMaps ||
      (window.google && // eslint-disable-line no-extra-parens
        window.google.maps) ||
      this.googleMaps;

    /* istanbul ignore next */
    if (!googleMaps) {
      console.error(// eslint-disable-line no-console
        'Google map api was not found in the page.');
      return;
    }
    this.googleMaps = googleMaps;

    this.autocompleteService = new googleMaps.places.AutocompleteService();
    this.geocoder = new googleMaps.Geocoder();

    // This resets the state to initial so that it does not render the validation
    // component until the element has been modified.  It would suck coming to a
    // blank form with a ton of validation errors on it already.
    const setBacktoInitialIfNecessary = () => {
      if (!Boolean(this.props.initialValue) && Boolean(this.props.requiredErrorComponent)) {
        this.setState({validationState: 'initial'});
      }
    };
    this.validate(this.props.initialValue, setBacktoInitialIfNecessary);
  }

  inputMatchesAutocomplete(userInput, matches, doesNotMatch) {
    const options = {
      input: userInput
    };

    ['location', 'radius', 'bounds', 'types'].forEach(option => {
      if (this.props[option]) {
        options[option] = this.props[option];
      }
    });

    if (this.props.country) {
      options.componentRestrictions = {
        country: this.props.country
      };
    }

    this.autocompleteService.getPlacePredictions(
      options,
      suggestsGoogle => {
        if (!Boolean(suggestsGoogle)
          || !(suggestsGoogle.some(suggest => suggest.description === userInput && matches(suggest)))) {
          doesNotMatch({description: userInput});
        }
      }
    );
  }

  isValid() {
    const isValidState = this.state.validationState === "valid",
      isNotRequiredAndEmpty = !Boolean(this.value) && !Boolean(this.props.requiredErrorComponent),
      checkValidationState = () => {
        this.validate(this.value, () => {});
        return false;
      };
    return isValidState || isNotRequiredAndEmpty || checkValidationState();
  }

  onChange(userInput) {
    this.setState({validationState: 'changing'}, () => this.props.onChange(userInput));
  }

  /**
   * Update the value of the user input
   * @param {String} userInput the new value of the user input
   * @param {Function} onAfterValidate called after the validtaion is complete. Function
   *   should look like Function(Boolean: isValid, String: suggest)
   */

  validate(userInput, onAfterValidate) {
    const shouldValidateInputFound = Boolean(this.props.notFoundErrorComponent),
      shouldValidateRequired = Boolean(this.props.requiredErrorComponent),
      afterValidate = (isValid, suggest) => {
        onAfterValidate(isValid, suggest);
        this.props.onAfterValidate(isValid, suggest);
      },
      inputIsValid = validSuggest => {
        this.setState(
          {validationState: 'valid'},
          afterValidate.bind(this, true, validSuggest)
        );
        return true;
      },
      inputIsNotValid = invalidSuggest => {
        this.setState(
          {validationState: 'invalidNotFound', notFoundCity: invalidSuggest.description},
          afterValidate.bind(this, false, invalidSuggest)
        );
        return false;
      };

    if (!Boolean(userInput) && shouldValidateRequired) {
      this.setState({validationState: 'invalidEmpty'}, afterValidate.bind(this, false, {description: userInput}));
    } else if (Boolean(userInput) && shouldValidateInputFound) {
      this.inputMatchesAutocomplete(userInput, inputIsValid, inputIsNotValid);
    } else {
      this.setState({validationState: 'valid'}, afterValidate.bind(this, true, {description: userInput}));
    }
  }

  onBlur(value) {
    const afterValidate = () => this.props.onBlur(value);
    this.validate(value, afterValidate);
  }

  renderValidationErrors() {
    let ErrorComponent = null;
    switch (this.state.validationState) {
      case "invalidEmpty":
        ErrorComponent = this.props.requiredErrorComponent;
        return <ErrorComponent/>;
      case "invalidNotFound":
        ErrorComponent = this.props.notFoundErrorComponent;
        return <ErrorComponent userInput={this.state.notFoundCity}/>;
      default:
        return null;
    }
  }

  render() {
    const {onChange, onBlur, errorInputClassName, ...otherProps} = this.props;
    let cx = "";
    if (this.state.validationState === "invalidEmpty" || this.state.validationState === "invalidNotFound") {
      cx += errorInputClassName;
    }
    return (
      <div className={cx}>
        <BaseGeocomplete ref="geocompleteBase" onChange={this.onChange} onBlur={this.onBlur} {...otherProps}/>
        {this.renderValidationErrors()}
      </div>
    );
  }
}

/**
 * Types for the properties
 * @type {Object}
 */
ValidatedGeocomplete.propTypes = propTypes;

/**
 * Default values for the properties
 * @type {Object}
 */
ValidatedGeocomplete.defaultProps = defaults;

export default ValidatedGeocomplete;
