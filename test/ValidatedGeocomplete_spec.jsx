import React from 'react'; // eslint-disable-line no-unused-vars
import {expect} from 'chai';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import googleStub from './google_stub';
import ValidatedGeocomplete from '../src/ValidatedGeocomplete.jsx';
import BaseGeocomplete from '../src/BaseGeocomplete.jsx';

window.google = global.google = googleStub();

describe('Component: ValidatedGeocomplete', () => {
  let component = null,
    onSuggestSelect = null,
    onActivateSuggest = null,
    onSuggestNoResults = null,
    onFocus = null,
    onChange = null,
    onBlur = null,
    render = props => {
      onSuggestSelect = sinon.spy();
      onActivateSuggest = sinon.spy();
      onSuggestNoResults = sinon.spy();
      onChange = sinon.spy();
      onFocus = sinon.spy();
      onBlur = sinon.spy();
      component = TestUtils.renderIntoDocument(
        <ValidatedGeocomplete
          radius='20'
          queryDelay={0}
          onSuggestSelect={onSuggestSelect}
          onActivateSuggest={onActivateSuggest}
          onSuggestNoResults={onSuggestNoResults}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            'input': {
              'borderColor': '#000'
            },
            'suggests': {
              'borderColor': '#000'
            },
            'suggestItem': {
              'borderColor': '#000',
              'borderWidth': 1
            }
          }}
          {...props}
        />
      );
    };
  describe('default', () => {
    beforeEach(() => render());

    it('renders a wrapped version of the Geocomplete component', () => {
      TestUtils.findRenderedComponentWithType(component, BaseGeocomplete);
    });

    describe('isValid()', () => {
      it('should return true with empty input', () => {
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });

      it('should return true with an input that does not have any autocomplete suggestions', () => { // eslint-disable-line max-len
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'There is no result for this. Really.'; // This does not match a fixture
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });

      it('should return true if the input matches an autocomplete description', () => {
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'New York, NY, United States';
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });

      it('should return true with an input that autocompletes to a suggestion', () => {
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'New'; // This does match a fixture but not fully
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });
    });
  });

  describe('when a requiredErrorComponent is provided', () => {
    const requiredErrorComponentClass = "geocomplete__required-error",
      requiredErrorComponent = () => <div className={requiredErrorComponentClass}>It is required</div>,
      props = {
        requiredErrorComponent: requiredErrorComponent
      };

    beforeEach(() => render(props));

    describe("isValid()", () => {
      it('should return false with empty input', () => {
        expect(component.isValid()).to.be.false; // eslint-disable-line no-unused-expressions
      });

      it('should return true with an input that does not have any autocomplete suggestions', () => { // eslint-disable-line max-len
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'There is no result for this. Really.'; // This does not match a fixture
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });

      it('should return true if the input matches an autocomplete description', () => {
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'New York, NY, United States';
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });

      it('should return true with an input that autocompletes to a suggestion', () => {
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'New'; // This does match a fixture but not fully
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });

      it('should return false if the input has been changed and then set to empty again', () => {
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'New'; // This does match a fixture but not fully
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = '';
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.false; // eslint-disable-line no-unused-expressions
      });
    });

    describe("requiredErrorComponent", () => {
      it("Does not render this component on intial render", () => {
        const errors = TestUtils.scryRenderedDOMComponentsWithClass(component, requiredErrorComponentClass); // eslint-disable-line max-len
        expect(errors).to.be.empty; // eslint-disable-line no-unused-expressions
      });

      it("Does not render requiredErrorComponent if there is a value entered", () => {
        let errors = null;
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'There is no result for this. Really.'; // This does not match a fixture
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        errors = TestUtils.scryRenderedDOMComponentsWithClass(component, requiredErrorComponentClass); // eslint-disable-line max-len
        expect(errors).to.be.empty; // eslint-disable-line no-unused-expressions
      });

      it("Does render requiredErrorComponent if there has been a change to the input and the input is blurred", () => {
        let errors = null;
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        errors = TestUtils.scryRenderedDOMComponentsWithClass(component, requiredErrorComponentClass); // eslint-disable-line max-len
        expect(errors).to.have.lengthOf(1); // eslint-disable-line no-unused-expressions
      });
    });
  });

  describe('when a notFoundErrorComponent is provided', () => {
    const notFoundErrorComponentClass = "geocomplete__not-found-error",
      notFoundErrorComponent = props => <div className={notFoundErrorComponentClass}>Could not find {props.userInput}</div>,
      props = {
        notFoundErrorComponent: notFoundErrorComponent
      };

    beforeEach(() => render(props));

    describe("isValid()", () => {
      it('should return true with empty input', () => {
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });

      it('should return false with an input that does not have any autocomplete suggestions', () => { // eslint-disable-line max-len
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'There is no result for this. Really.'; // This does not match a fixture
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.false; // eslint-disable-line no-unused-expressions
      });

      it('should return true if the input matches an autocomplete description', () => {
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'New York, NY, United States';
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });

      it('should return false with an input that autocompletes to a suggestion', () => {
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'New'; // This does match a fixture but not fully
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.false; // eslint-disable-line no-unused-expressions
      });

      it('should return true if the input does not match but a suggestion is selected', () => {
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        geocompleteInput.value = 'New'; // This does match a fixture but not fully
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.keyDown(geocompleteInput, {
          key: 'keyDown',
          keyCode: 40,
          which: 40
        });
        TestUtils.Simulate.keyDown(geocompleteInput, {
          key: 'Enter',
          keyCode: 13,
          which: 13
        });
        TestUtils.Simulate.blur(geocompleteInput);
        expect(component.isValid()).to.be.true; // eslint-disable-line no-unused-expressions
      });
    });

    describe("notFoundErrorComponent", () => {
      it("Does not render this component on intial render", () => {
        const errors = TestUtils.scryRenderedDOMComponentsWithClass(component, notFoundErrorComponentClass); // eslint-disable-line max-len
        expect(errors).to.be.empty; // eslint-disable-line no-unused-expressions
      });

      it("Does not render requiredErrorComponent if there has been a change to the input and the input is blurred", () => {
        let errors = null;
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'New York, NY, United States'; // This matches a fixture
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        errors = TestUtils.scryRenderedDOMComponentsWithClass(component, notFoundErrorComponentClass); // eslint-disable-line max-len
        expect(errors).to.be.empty; // eslint-disable-line no-unused-expressions
      });

      it("Does render requiredErrorComponent if there has been a change to the input and the input is blurred", () => {
        let errors = null;
        const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
        TestUtils.Simulate.focus(geocompleteInput);
        geocompleteInput.value = 'There is no result for this. Really.'; // This does not match a fixture
        TestUtils.Simulate.change(geocompleteInput);
        TestUtils.Simulate.blur(geocompleteInput);
        errors = TestUtils.scryRenderedDOMComponentsWithClass(component, notFoundErrorComponentClass); // eslint-disable-line max-len
        expect(errors).to.have.lengthOf(1); // eslint-disable-line no-unused-expressions
      });
    });
  });

  describe('with autoActivateFirstSuggest set to false', () => {
    const props = {
      autoActivateFirstSuggest: true
    };

    beforeEach(() => render(props));

    it('isValid() should return false with an input that does not have any autocomplete suggestions', () => { // eslint-disable-line max-len
      const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
      geocompleteInput.value = 'There is no result for this. Really.'; // This does not match a fixture
      TestUtils.Simulate.change(geocompleteInput);
      expect(component.isValid()).to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('isValid() should return false with an input that does not match any of the autosuggestions', () => {
      const geocompleteInput = TestUtils.findRenderedDOMComponentWithClass(component, 'geosuggest__input'); // eslint-disable-line max-len
      geocompleteInput.value = 'New'; // This does match a fixture but not fully
      TestUtils.Simulate.change(geocompleteInput);
      expect(component.isValid()).to.be.false; // eslint-disable-line no-unused-expressions
    });
  });
});
