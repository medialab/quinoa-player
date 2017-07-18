Quinoa presentation document model description
===

## Anatomy of a presentation

```js
{
  "type": "quinoa-presentation", // type identifier
  "id": <String>, // self identification
  "metadata": <Object>, // metadata of the whole presentation
  "datasets": <Object>, // map of the datasets used along the presentation (keys are uuids)
  "visualizations": <Object>, // map of the visualizations used in the presentation (keys are uuids)
  "slides": <Object>, // map of the slides used in the presentation (keys are uuids)
  "order": <Array>, // list of the slides to display in presentation
  "settings": <Object> // presentation's display settings
}
```

## Anatomy of a presentation's metadata

```js
{
  "authors": <Array<String>>, // authors of the data
  "description": <String>, // description to be displayed
  "title": <String> // title to be displayed
  "gistId": <String> // gist id
  "gistUrl": <String> // gist url
  "server url": <String> // server url
}
```

## Anatomy of a presentation's dataset

```js
{
  "metadata": {
    "format": <String>, // data structure format (e.g. json, graphml, csv, ...)
    "fileName": <String>, // name of the file used to produce the dataset
    "title": <String>, // title of the dataset
    "description": <String>, // information about dataset
    "url": <String>, // information about dataset's url
    "license": <String> // information about dataset's license
  },
  "rawData": <String> // dataset as a raw string of characters
}
```

## Anatomy of a presentation's visualization

```js
{
  "metadata": {
    "visualizationType": <String> // the type of the visualization
  }, // 
  "data": <Object>, // map of data's collections (each collection is represented by an array of js objects)
  "dataMap": <Object>, // editable map of data collections' data maps (what data property to map to what visualization property)
  "flattenedDataMap": <Object>, // operationalizable map of data collections' data maps (what data property to map to what visualization property)
  "datasets": <Array<String>>, // array of visualization's datasets' id
  "colorsMap": <Object>, // map of visualization's collections maps
  "viewParameters": <Object>, // state of the visualizations
  "viewOptions": <Array<Object>> // editable options of the view
}
```

## Anatomy of a presentation's slide

```js
{
  "views": { // map of the visualization's views (one or several) parameters
    "736e6287-205d-473e-ad95-26702310a025": {
      "viewParameters": {
        "paramX": <String|Number>, // visualizationType-specific params
        "colorsMap": <Object>, // colors map
        "dataMap": <Object>, // editable data map
        "flattenedDataMap": <Object>, // operationalized data map
        "shownCategories": <Object> // map of categories to be shown
      }
    }
  },
  "title": <String>, // title of the slide
  "markdown": <String>, // markdown contents
  "id": <String> // self-identification of the slide
}
```

## Anatomy of a presentation's settings

```js
{
  "template": <String> // the template to use to display the presentation
  "css": <String> // custom css to inject when displaying the presentation
}
```







