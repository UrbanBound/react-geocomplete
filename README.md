# React Geocomplete

A [React](http://facebook.github.io/react/) autosuggest for the Google Maps Places API. This is based on [Ubilabs' Geosuggest](https://github.com/ubilabs/react-geosuggest). For rundown of important differences, please see below.


## Differences from Ubilabs' Geosuggest
* This component includes a ValidatedGeocomplete component for rendering validation errors
* The onSuggestSelect for the base component does not fire when no suggest is selected when no suggests are found (See [this issue](https://github.com/ubilabs/react-geosuggest/issues/191))
* This package does not require React 15
* Both components have a `value()` getter method.

## Installation

As this component uses the Google Maps Places API to get suggests, you must include the Google Maps Places API in the `<head>` of your HTML:

```html
<!DOCTYPE html>
  <html>
  <head>
    …
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places"></script>
  </head>
  <body>
    …
  </body>
</html>
```

Visit the [Google Developer Console](https://console.developers.google.com) to generate your API key.

The easiest way to use geocomplete is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), [Webpack](http://webpack.github.io/), etc).

You might also be able to use the standalone build by including `dist/react-geosuggest.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable. I've never been able to get this to work though.

```
npm install react-geocomplete --save
```

## Usage

For using the base component, please see [Ubilabs documentation](https://github.com/ubilabs/react-geosuggest/tree/v1.24.1). It's mostly the same as that.

### ValidatedGeocomplete
The ValidatedGeocomplete is very similar to the Geocomplete component, except that it allows you to validate that your input matches an autocomplete description or that the field is required.  You can provide a custom component for the validation errors.

#### Properties
##### notFoundErrorComponent
Type: `Component` Default: `null`
This  element, when provided, will impose a validation constraint on the element that its value must match an autocomplete suggestion description. The `notFoundErrorComponent` component may make use of the `userInput` property which will be passed to it.

Type: `Component` Default: `null`
This  element, when provided, will impose a validation constraint on the element that its value must be present.

## License

See [LICENSE.md](LICENSE.md)
