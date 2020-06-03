const mongoose = require('mongoose');
const jsonapi = require('../');

const sampleSchema = mongoose.Schema({
  name: String,
});

sampleSchema.plugin(jsonapi, { name: 'sample' });

const Sample = mongoose.model('Sample', sampleSchema);

describe('mongoose-jsonapi', () => {
  describe('Class Methods', () => {
    describe('.serialize()', () => {
      it('should serialize a model', () => {
        const s = new Sample({ name: 'Sample Name' });
        const serialized = Sample.serialize(s);

        serialized.should.have.property('data');
        serialized.data.should.be.Object();

        const data = serialized.data;
        data.should.have.property('type');
        data.type.should.eql('samples');
        data.should.have.property('id');
        data.id.should.eql(s.id);
        data.should.have.property('attributes');
        data.attributes.should.be.Object();

        const attr = data.attributes;
        attr.should.have.property('name');
        attr.name.should.eql(s.name);
      });
    });

    describe('.deserialize()', () => {
      it('should deserialize a model', () => {
        const data = {
          data: {
            type: 'samples',
            id: 'sample_id',
            attributes: {
              name: 'Sample Name',
            },
          },
        };

        return Sample.deserialize(data).then((output) => {
          output.should.have.property('id');
          output.id.should.eql(data.data.id);
          output.should.have.property('name');
          output.name.should.eql(data.data.attributes.name);
        });
      });
    });

    describe('.fromJSONAPI()', () => {
      it('should deserialize a model', () => {
        const data = {
          data: {
            type: 'samples',
            id: new mongoose.Types.ObjectId(),
            attributes: {
              name: 'Sample Name',
            },
          },
        };

        return Sample.fromJSONAPI(data).then((sample) => {
          sample.should.be.instanceOf(Sample);
          sample.id.should.eql(data.data.id.toString());
          sample.name.should.eql(data.data.attributes.name);
        });
      });
    });
  });

  describe('Instance Methods', () => {
    describe('#serialize()', () => {
      it('should serialize a model', () => {
        const s = new Sample({ name: 'Sample Name' });
        const serialized = s.serialize();

        serialized.should.have.property('data');
        serialized.data.should.be.Object();

        const data = serialized.data;
        data.should.have.property('type');
        data.type.should.eql('samples');
        data.should.have.property('id');
        data.id.should.eql(s.id);
        data.should.have.property('attributes');
        data.attributes.should.be.Object();

        const attr = data.attributes;
        attr.should.have.property('name');
        attr.name.should.eql(s.name);
      });
    });

    describe('#updateFromJSONAPI()', () => {
      it('should update a model', () => {
        const s = new Sample({ name: 'Sample Name' });

        const data = {
          data: {
            id: s.id,
            type: 'samples',
            attributes: { name: 'New Name' },
          },
        };

        return s.updateFromJSONAPI(data).then(() => {
          s.should.be.instanceOf(Sample);
          s.name.should.eql(data.data.attributes.name);
        });
      });
    });
  });
});
