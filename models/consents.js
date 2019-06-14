const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-url');
const uuid = require('node-uuid');
const mongoosePaginate = require('mongoose-paginate-v2');

// Schema definition for document object
const documentSchema = new Schema({
    version: {
        type: Number,
        min: [1, 'Invalid version number'],
        default: 1,
    },
    short_name: {
        type: String,
        required: [true, 'Short name is a mandatory field']
    },
    content: {
        type: String,
        required: [true, 'Document content is a mandatory field']
    }
}, {
    toJSON: {
        transform: function (doc, ret) {
            json = {
                version: ret.version,
            };
            json[ret.short_name] = ret.content;

            return json;
        }
    }
});

// Schema definition for consent object
const consentSchema = new Schema({
    _id: {
        type: String,
        default: uuid.v4
    },
    ip: {
        type: String,
        validate: {
            validator: function (ip) {
                return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm.test(ip);

            },
            message: ip => `${ip.value} is not a valid ip`
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    subject: [String],
    source_url: {
        type: mongoose.SchemaTypes.Url
    },
    legal_docs: [documentSchema]
}, {
    toJSON: {
        transform: function (doc, ret) {
            return {
                id: ret._id,
                ip: ret.ip,
                created_at: ret.created_at,
                subject: ret.subject,
                source_url: ret.source_url,
                legal_docs: ret.legal_docs
            }
        }
    }

});
consentSchema.plugin(mongoosePaginate);
//consentSchema.plugin(MongoPaging.mongoosePlugin);

const Consents = mongoose.model('Consent', consentSchema);
const Documents = mongoose.model('Documents', documentSchema);

module.exports = {Consents: Consents, Documents: Documents};

