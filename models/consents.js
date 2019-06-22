const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-type-url');
const uuid = require('uuid');
const mongoPaging = require('mongo-cursor-pagination');

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
    versionKey: false,
    toJSON: {
        transform: function (doc, ret) {
            json = {
                version: ret.version
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
            // validator for both ipv4 and ipv6
            validator: function (ip) {
                return /^((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))$/gm.test(ip);
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
    versionKey: false,
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

// Defaults
mongoPaging.config.DEFAULT_LIMIT = 50;
mongoPaging.config.MAX_LIMIT = 300;
consentSchema.plugin(mongoPaging.mongoosePlugin);

const Consents = mongoose.model('Consent', consentSchema);
const Documents = mongoose.model('Documents', documentSchema);

module.exports = {Consents: Consents, Documents: Documents};
