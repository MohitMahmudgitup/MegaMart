"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.PaymentStatus = void 0;
// Enums
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["Approved"] = "approved";
    PaymentStatus["OnHold"] = "on-hold";
    PaymentStatus["Processing"] = "processing";
    PaymentStatus["Pending"] = "pending";
    PaymentStatus["Rejected"] = "rejected";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["Bikash"] = "bikash";
    PaymentMethod["Visa"] = "visa";
    PaymentMethod["Bank"] = "bank";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
