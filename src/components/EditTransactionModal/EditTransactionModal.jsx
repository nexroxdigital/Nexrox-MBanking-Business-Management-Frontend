// ============================================
// FILE: components/EditTransactionModal.jsx
// Reusable modal for editing daily transactions
// Dynamically shows/hides fields based on transaction type
// ============================================

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Field } from "../../pages/Field";

export default function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onSubmit,
  walletNumbers = [],
  allClients = [],
}) {
  const [customMessage, setCustomMessage] = useState("");

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {},
  });

  // Populate form with existing transaction data
  useEffect(() => {
    if (transaction && isOpen) {
      reset({
        date: transaction.date || "",
        channel: transaction.wallet_id || transaction.channel || "",
        type: transaction.type || "",
        amount: transaction.amount || "",
        commission: transaction.fee || "",
        total: transaction.total || "",
        profit: transaction.profit || "",
        due: transaction.due || "",
        note: transaction.note || "",
        billType: transaction.bill_type || "",
        clientId: transaction.client_id || "",
        txn_id: transaction.txn_id || "",
        number: transaction.number || "",
        paid: transaction.paid || "",
        refund: transaction.refund || "",
        isSendMessage: false,
      });
    }
  }, [transaction, isOpen, reset]);

  // Watch form values for dynamic calculations
  const amount = parseFloat(watch("amount")) || 0;
  const commission = parseFloat(watch("commission")) || 0;
  const type = watch("type");
  const channel = watch("channel");
  const billType = watch("billType");
  const isSendMessage = watch("isSendMessage");

  // Get selected wallet to check its type
  const selectedWallet = walletNumbers?.find((w) => w._id === channel);
  const isPersonalWallet = selectedWallet?.type?.toLowerCase() === "personal";
  const isBillPayment = channel === "Bill Payment";
  const isCashWallet =
    typeof channel === "string" && channel.toLowerCase() === "cash";

  // Auto-calculate total and profit
  useEffect(() => {
    if (!amount) return;

    let computedProfit = 0;
    let computedTotal = amount;

    if (!isCashWallet && commission) {
      // Agent wallet calculations
      if (
        type === "Cash In" ||
        type?.toLowerCase() === "send money" ||
        type?.toLowerCase() === "receive money"
      ) {
        computedProfit = (amount * commission) / 100;
      } else if (type === "Cash Out") {
        computedProfit = (amount * commission) / 1000;
      } else if (isBillPayment) {
        computedProfit = commission;
      }

      computedTotal = amount + computedProfit;
    }

    setValue("profit", computedProfit.toFixed(2));
    setValue("total", computedTotal.toFixed(2));
  }, [amount, commission, type, isCashWallet, isBillPayment, setValue]);

  // Auto-generate SMS message
  useEffect(() => {
    if (!isSendMessage) {
      setCustomMessage("");
      return;
    }

    if (type === "Cash Out") {
      setCustomMessage(
        `${amount} টাকা ক্যাশ-আউট করা হয়েছে।\n- এসএন আইটি পয়েন্ট।`
      );
    } else if (type === "Cash In") {
      setCustomMessage(
        `${amount} টাকা ক্যাশ-ইন করা হয়েছে।\n- এসএন আইটি পয়েন্ট।`
      );
    } else if (isBillPayment) {
      setCustomMessage(
        `${amount} টাকা ${billType} বিল পে করা হয়েছে\n- এসএন আইটি পয়েন্ট।`
      );
    }
  }, [isSendMessage, type, amount, billType, isBillPayment]);

  // Handle form submission
  const handleFormSubmit = (data) => {
    // Prepare update data - only send fields that exist
    const updateData = {
      date: data.date,
      type: isBillPayment ? data.billType : data.type,
      amount: parseFloat(data.amount),
      profit: parseFloat(data.profit) || 0,
      total: parseFloat(data.total) || 0,
      due: parseFloat(data.due) || 0,
      note: data.note || "",
    };

    // Add optional fields if they exist
    if (data.channel) updateData.wallet_id = data.channel;
    if (data.commission) updateData.fee = parseFloat(data.commission);
    if (data.clientId) updateData.client_id = data.clientId;
    if (data.billType) updateData.bill_type = data.billType;
    if (data.txn_id) updateData.txn_id = data.txn_id;
    if (data.number) updateData.number = data.number;
    if (data.paid) updateData.paid = parseFloat(data.paid);
    if (data.refund) updateData.refund = parseFloat(data.refund);
    if (data.isSendMessage) {
      updateData.isSendMessage = true;
      updateData.message = customMessage;
    }

    // Call parent onSubmit handler
    onSubmit(updateData);

    // Close modal
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", onEsc);
    }
    return () => document.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit transaction"
        className="relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl border bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto"
        style={{
          borderImageSlice: 1,
          borderImageSource:
            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top bar */}
        <div
          className="h-1 w-full rounded-t-2xl"
          style={{
            background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
          }}
        />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              ট্রান্সাকশন এডিট করুন
            </h3>
            <button
              onClick={onClose}
              className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:opacity-90"
            >
              Close
            </button>
          </div>

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Date - Always show */}
              <Field label="তারিখ">
                <input
                  type="date"
                  {...register("date", { required: true })}
                  className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </Field>

              {/* Wallet/Channel - Show if wallet_id exists */}
              {transaction.wallet_id && (
                <Field label="ওয়ালেট">
                  <select
                    {...register("channel")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {walletNumbers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.label}
                      </option>
                    ))}
                    <option value="Bill Payment">Bill Payment</option>
                    <option value="Cash">Cash</option>
                  </select>
                </Field>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Bill Type - Show if bill_type exists */}
              {transaction.bill_type && (
                <Field label="বিল টাইপ">
                  <select
                    {...register("billType")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">— সিলেক্ট —</option>
                    <option value="Electricity">Electricity</option>
                    <option value="Internet">Internet</option>
                    <option value="Gas">Gas</option>
                    <option value="others">Others</option>
                  </select>
                </Field>
              )}

              {/* Type - Show if not bill payment and not cash */}
              {!isBillPayment &&
                !isCashWallet &&
                transaction.type !== "cash" && (
                  <Field label="টাইপ">
                    <select
                      {...register("type")}
                      className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {isPersonalWallet
                        ? ["Send Money", "Receive Money"].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))
                        : ["Cash In", "Cash Out"].map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                    </select>
                  </Field>
                )}

              {/* Amount - Always show */}
              <Field label="অ্যামাউন্ট (৳)">
                <input
                  type="number"
                  step="any"
                  {...register("amount", { required: true })}
                  className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Commission - Show if not cash wallet */}
              {!isCashWallet && transaction.fee !== undefined && (
                <Field
                  label={
                    type === "Cash In" ||
                    type === "Send Money" ||
                    type === "Receive Money"
                      ? "কমিশন (%)"
                      : isBillPayment
                      ? "কমিশন (৳)"
                      : "কমিশন (প্রতি হাজারে)"
                  }
                >
                  <input
                    type="number"
                    step="any"
                    {...register("commission")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </Field>
              )}

              {/* Total - Show if exists */}
              {!isCashWallet && transaction.total !== undefined && (
                <Field label="টোটাল">
                  <input
                    type="number"
                    step="any"
                    {...register("total")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </Field>
              )}

              {/* Profit - Show if exists */}
              {transaction.profit !== undefined && (
                <Field label="লাভ">
                  <input
                    type="number"
                    step="any"
                    {...register("profit")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </Field>
              )}

              {/* Client - Show if client_id exists or allClients provided */}
              {(transaction.client_id || allClients.length > 0) && (
                <Field label="ক্লায়েন্ট">
                  <select
                    {...register("clientId")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">— সিলেক্ট —</option>
                    {allClients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}

              {/* Due - Show if exists */}
              {!isCashWallet && transaction.due !== undefined && (
                <Field label="বাকি (৳)">
                  <input
                    type="number"
                    step="any"
                    {...register("due")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </Field>
              )}

              {/* Number - Show if exists (for personal wallet) */}
              {transaction.number && (
                <Field label="নম্বর">
                  <input
                    type="text"
                    {...register("number")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </Field>
              )}

              {/* Paid - Show if exists */}
              {transaction.paid !== undefined && (
                <Field label="পরিশোধ">
                  <input
                    type="number"
                    step="any"
                    {...register("paid")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </Field>
              )}

              {/* Refund - Show if exists */}
              {transaction.refund !== undefined && (
                <Field label="রিফান্ড">
                  <input
                    type="number"
                    step="any"
                    {...register("refund")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </Field>
              )}

              {/* Txn ID - Show if exists */}
              {transaction.txn_id !== undefined && (
                <Field label="Txn ID">
                  <input
                    type="text"
                    {...register("txn_id")}
                    className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </Field>
              )}

              {/* Note - Always show */}
              <Field label="নোট">
                <input
                  {...register("note")}
                  className="w-full rounded-xl px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="নোট লিখুন..."
                />
              </Field>
            </div>

            {/* SMS Checkbox */}
            <div className="flex items-center gap-2">
              <input
                className="w-4 h-4 cursor-pointer accent-[#009C91]"
                id="editMessage"
                type="checkbox"
                {...register("isSendMessage")}
              />
              <label
                htmlFor="editMessage"
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                SMS পাঠান
              </label>
            </div>

            {/* SMS Message Textarea */}
            {isSendMessage && (
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                  Message
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  style={{ whiteSpace: "pre-line" }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:opacity-90"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-white font-semibold shadow-md transition
                         bg-gradient-to-r from-[#862C8A] to-[#009C91]
                         hover:opacity-95 active:scale-[0.99]"
              >
                আপডেট করুন
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
