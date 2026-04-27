import { CheckCircle2, Package, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PaymentConfirmModal({
  total,
  onClose,
  onConfirm,
  loading,
}: {
  total: number;
  onClose: () => void;
  onConfirm: (data: {
    method: 'bkash' | 'nagad';
    transactionId: string;
    mobileNumber: string;
    screenshot: File;
  }) => void;
  loading: boolean;
}) {
  const [method, setMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [transactionId, setTransactionId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!transactionId.trim()) errs.txn = 'Transaction ID দিন';
    if (!mobileNumber.trim() || mobileNumber.length < 11) errs.mobile = 'সঠিক নম্বর দিন';
    if (!screenshot) errs.ss = 'Screenshot আপলোড করুন';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onConfirm({ method, transactionId, mobileNumber, screenshot: screenshot! });
  };

  

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="font-semibold text-gray-900">Payment confirmation</p>
            <p className="text-xs text-gray-500 mt-0.5">Total: ৳{total.toFixed(0)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">প্রথমে টাকা পাঠান</p>
            <p className="text-xs leading-relaxed">
              01835972300 নম্বরে bKash বা Nagad এ ৳{total.toFixed(0)} পাঠান,
              তারপর নিচের ফর্মটি পূরণ করুন।
            </p>
            <div className="mt-2 inline-flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-sm font-semibold">
              📞 01835972300
            </div>
          </div>

          {/* Method select */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Payment method</p>
            <div className="grid grid-cols-2 gap-2">
              {(['bkash', 'nagad'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    method === m
                      ? m === 'bkash'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-900 capitalize">{m === 'bkash' ? 'bKash' : 'Nagad'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Send money</p>
                </button>
              ))}
            </div>
          </div>

          {/* Transaction ID */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Transaction ID *</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => { setTransactionId(e.target.value); setErrors(p => ({...p, txn: ''})); }}
              placeholder="e.g. 8FG2H3K9PQ"
              className={`w-full px-3 py-2.5 text-sm rounded-xl border ${errors.txn ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-200`}
            />
            {errors.txn && <p className="text-xs text-red-500 mt-1">{errors.txn}</p>}
          </div>

          {/* Mobile */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">আপনার মোবাইল নম্বর *</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => { setMobileNumber(e.target.value); setErrors(p => ({...p, mobile: ''})); }}
              placeholder="01XXXXXXXXX"
              maxLength={11}
              className={`w-full px-3 py-2.5 text-sm rounded-xl border ${errors.mobile ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-orange-200`}
            />
            {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
          </div>

          {/* Screenshot */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Payment screenshot *</label>
            <label
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
                errors.ss ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-orange-300 bg-gray-50'
              }`}
            >
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              {preview ? (
                <Image src={preview} alt="Screenshot" width={200} height={120} className="object-contain rounded-lg max-h-28" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500">Click to upload screenshot</p>
                </>
              )}
            </label>
            {errors.ss && <p className="text-xs text-red-500 mt-1">{errors.ss}</p>}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Confirm order</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}