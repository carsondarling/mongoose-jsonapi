# Mongoose JSONAPI Plugin

This is a plugin for Mongoose that provides JSON API-compliant serialization and deserialization for Mongoose models.

## Usage

```node
const mongoose = require('mongoose');
const jsonapi = require('@carsondarling/mongoose-jsonapi');

const sampleSchema = mongoose.Schema({
  name: String,
});

sampleSchema.plugin(jsonapi, { name: 'sample' });
const Sample = mongoose.model('Sample', sampleSchema);

const document = new Sample({ name: 'Sample Name' });
document.serialize(); // -> JSON API document
Sample.serialize(document); // -> JSON API document

const jsonAPIDocument = {
  data: {
    type: 'samples',
    id: '58868a32879743b79f1cbc36',
    attributes: {
      name: 'Sample Name',
    },
  },
};

Sample.fromJSONAPI(jsonAPIDocument)
  .then(sample => {
    // -> Sample document
  });
```

## API

### Plugin Constructor

```node
schema.plugin(jsonapi, { 
  name: 'sample',
  attributes: [ // -> array of attribute names to be included when serialized
    'name',
  ],
  keyForAttributes: 'camelCase', // method for converting key names
});
```

### Model.serialize(document)

Produces a JSON-API representation of a Mongoose document.

`model`: Mongoose document

### Model.deserialize(resource)

**Async** Produces a plain JavaScript object that contains the information in the JSON-API compliant resource.

`resource`: A JSON-API compliant object that describes a resource

### Model.fromJSONAPI(resource)

**Async** Produces a document that is an instance of the Model from a JSON-API compliant resource.

`resource`: A JSON-API compliant object that describes a resource

### document.serialize()

Produces a JSON-API representation of the document.

### document.updateFromJSONAPI(resource)

**Async** Updates the document form the JSON-API compliant resource.

`resource`: A JSON-API compliant object that describes a resource
