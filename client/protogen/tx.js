"use strict";
exports.__esModule = true;
exports.MsgClientImpl = exports.MsgEstimateResponse = exports.MsgEstimate = exports.protobufPackage = void 0;
/* eslint-disable */
var Long = require("long");
var protobuf = require("protobufjs/minimal");
//import _m0 from "protobufjs/minimal";
exports.protobufPackage = "testhellochain.estimator";
function createBaseMsgEstimate() {
    return { creator: "", start: Long.UZERO, end: Long.UZERO };
}
exports.MsgEstimate = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = protobuf.Writer.create(); }
        if (message.creator !== "") {
            writer.uint32(10).string(message.creator);
        }
        if (!message.start.isZero()) {
            writer.uint32(16).uint64(message.start);
        }
        if (!message.end.isZero()) {
            writer.uint32(24).uint64(message.end);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof protobuf.Reader ? input : new protobuf.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = createBaseMsgEstimate();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.creator = reader.string();
                    break;
                case 2:
                    message.start = reader.uint64();
                    break;
                case 3:
                    message.end = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        return {
            creator: isSet(object.creator) ? String(object.creator) : "",
            start: isSet(object.start) ? Long.fromValue(object.start) : Long.UZERO,
            end: isSet(object.end) ? Long.fromValue(object.end) : Long.UZERO
        };
    },
    toJSON: function (message) {
        var obj = {};
        message.creator !== undefined && (obj.creator = message.creator);
        message.start !== undefined && (obj.start = (message.start || Long.UZERO).toString());
        message.end !== undefined && (obj.end = (message.end || Long.UZERO).toString());
        return obj;
    },
    fromPartial: function (object) {
        var _a;
        var message = createBaseMsgEstimate();
        message.creator = (_a = object.creator) !== null && _a !== void 0 ? _a : "";
        message.start = (object.start !== undefined && object.start !== null) ? Long.fromValue(object.start) : Long.UZERO;
        message.end = (object.end !== undefined && object.end !== null) ? Long.fromValue(object.end) : Long.UZERO;
        return message;
    }
};
function createBaseMsgEstimateResponse() {
    return { distance: Long.UZERO, time: Long.UZERO };
}
exports.MsgEstimateResponse = {
    encode: function (message, writer) {
        if (writer === void 0) { writer = protobuf.Writer.create(); }
        if (!message.distance.isZero()) {
            writer.uint32(8).uint64(message.distance);
        }
        if (!message.time.isZero()) {
            writer.uint32(16).uint64(message.time);
        }
        return writer;
    },
    decode: function (input, length) {
        var reader = input instanceof protobuf.Reader ? input : new protobuf.Reader(input);
        var end = length === undefined ? reader.len : reader.pos + length;
        var message = createBaseMsgEstimateResponse();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.distance = reader.uint64();
                    break;
                case 2:
                    message.time = reader.uint64();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON: function (object) {
        return {
            distance: isSet(object.distance) ? Long.fromValue(object.distance) : Long.UZERO,
            time: isSet(object.time) ? Long.fromValue(object.time) : Long.UZERO
        };
    },
    toJSON: function (message) {
        var obj = {};
        message.distance !== undefined && (obj.distance = (message.distance || Long.UZERO).toString());
        message.time !== undefined && (obj.time = (message.time || Long.UZERO).toString());
        return obj;
    },
    fromPartial: function (object) {
        var message = createBaseMsgEstimateResponse();
        message.distance = (object.distance !== undefined && object.distance !== null)
            ? Long.fromValue(object.distance)
            : Long.UZERO;
        message.time = (object.time !== undefined && object.time !== null) ? Long.fromValue(object.time) : Long.UZERO;
        return message;
    }
};
var MsgClientImpl = /** @class */ (function () {
    function MsgClientImpl(rpc, opts) {
        this.service = (opts === null || opts === void 0 ? void 0 : opts.service) || "testhellochain.estimator.Msg";
        this.rpc = rpc;
        this.Estimate = this.Estimate.bind(this);
    }
    MsgClientImpl.prototype.Estimate = function (request) {
        var data = exports.MsgEstimate.encode(request).finish();
        var promise = this.rpc.request(this.service, "Estimate", data);
        return promise.then(function (data) { return exports.MsgEstimateResponse.decode(new protobuf.Reader(data)); });
    };
    return MsgClientImpl;
}());
exports.MsgClientImpl = MsgClientImpl;
if (protobuf.util.Long !== Long) {
    protobuf.util.Long = Long;
    protobuf.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
