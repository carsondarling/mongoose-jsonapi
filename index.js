const _ = require('lodash');
const JSONAPI = require('jsonapi-serializer');

const JSONAPISerializer = JSONAPI.Serializer;
const JSONAPIDeserializer = JSONAPI.Deserializer;

/**
 * This plugin adds functions to a Mongoose schema for serializing and
 * deserializing data to JSON API.
 */
module.exports = function serializerPlugin(schema, options) {
  // Name must be supplied
  if (!options.name) throw new Error('The serializer plugin requires a name');

  // Normalize options
  const serializerOptions = _.defaultsDeep(options.serializer, {
    attributes: _.pull(_.keys(schema.paths), '_id'),
  });

  const deserializerOptions = _.defaultsDeep(options.deserializer, {
    keyForAttribute: 'camelCase',
  });

  const Serializer = new JSONAPISerializer(options.name, serializerOptions);
  const Deserializer = new JSONAPIDeserializer(deserializerOptions);

  /**
   * Generate a JSON-API compliant representation of this model.
   * @return {Object}
   */
  // eslint-disable-next-line no-param-reassign
  schema.methods.serialize = function serialize() {
    return Serializer.serialize(this);
  };

  /**
   * Update a model with a JSON-API compliant object. This does not save the
   * model, it simply updates the fields.
   * @param  {Object} data JSON-API compliant object
   * @return {Promise}     Promise that resolves with the updated model
   */
  // eslint-disable-next-line no-param-reassign
  schema.methods.updateFromJSONAPI = function updateFromJSONAPI(data) {
    return Deserializer.deserialize(data)
      .then(obj => {
        _.assign(this, _.omitBy(obj, _.isNil));
        return this;
      });
  };

  /**
   * Serialize a set of data using the model's Serializer.
   * @param  {Model} data An instance of the model or an array of models
   * @return {Object}     JSON-API compliant version of the data
   */
  // eslint-disable-next-line no-param-reassign
  schema.statics.serialize = function serialize(data) {
    return Serializer.serialize(data);
  };

  /**
   * Generate a plain Object from the JSON-API compliant source.
   * @param  {Object} data JSON-API compliant object
   * @return {Promise}     Promise that resolves with normalized data object
   */
  // eslint-disable-next-line no-param-reassign
  schema.statics.deserialize = function deserialize(data) {
    return Deserializer.deserialize(data)
      .then(obj => _.omitBy(obj, _.isNil));
  };

  /**
   * Create a new model from a JSON-API compliant object.
   * @param  {Object} data JSON-API compliant object
   * @return {Promise}     Promise that resolves with a new model
   */
  // eslint-disable-next-line no-param-reassign
  schema.statics.fromJSONAPI = function fromJSONAPI(data) {
    return Deserializer.deserialize(data)
      .then(document => {
        if (document.id) document._id = document.id;
        return document;
      })
      .then(document => new this(_.omitBy(document, _.isNil)));
  };
};

// Export underlying JSONAPI library
module.exports.JSONAPI = JSONAPI;
