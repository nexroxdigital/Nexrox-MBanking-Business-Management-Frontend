import { Calculator, Plus, Save, Trash2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const OpeningCashSystem = ({
  openingCash = 0,
  savedDenominations = null,
  onSave,
  isLoading = false,
}) => {
  const defaultDenominations = [
    { value: 1000, count: 0, enabled: true },
    { value: 500, count: 0, enabled: true },
    { value: 200, count: 0, enabled: true },
    { value: 100, count: 0, enabled: true },
    { value: 50, count: 0, enabled: true },
    { value: 20, count: 0, enabled: true },
    { value: 10, count: 0, enabled: true },
    { value: 5, count: 0, enabled: true },
    { value: 2, count: 0, enabled: true },
    { value: 1, count: 0, enabled: true },
  ];

  const [denominations, setDenominations] = useState(defaultDenominations);

  // Load saved denominations when component mounts or savedDenominations changes
  useEffect(() => {
    if (
      savedDenominations &&
      Array.isArray(savedDenominations) &&
      savedDenominations.length > 0
    ) {
      setDenominations(savedDenominations);
    } else {
      setDenominations(defaultDenominations);
    }
  }, [savedDenominations]);

  const updateCount = (index, newCount) => {
    const updated = [...denominations];
    updated[index].count = Math.max(0, parseInt(newCount) || 0);
    setDenominations(updated);
  };

  const toggleDenomination = (index) => {
    const updated = [...denominations];
    updated[index].enabled = !updated[index].enabled;
    if (!updated[index].enabled) {
      updated[index].count = 0;
    }
    setDenominations(updated);
  };

  const addCustomDenomination = () => {
    setDenominations([
      ...denominations,
      { value: 0, count: 0, enabled: true, custom: true },
    ]);
  };

  const removeCustomDenomination = (index) => {
    setDenominations(denominations.filter((_, i) => i !== index));
  };

  const updateCustomValue = (index, newValue) => {
    const updated = [...denominations];
    updated[index].value = Math.max(0, parseInt(newValue) || 0);
    setDenominations(updated);
  };

  const calculateTotal = () => {
    return denominations
      .filter((d) => d.enabled)
      .reduce((sum, d) => sum + d.value * d.count, 0);
  };

  const calculateSubtotal = () => {
    return denominations
      .filter((d) => d.enabled && d.value >= 5)
      .reduce((sum, d) => sum + d.value * d.count, 0);
  };

  const total = calculateTotal();
  const subtotal = calculateSubtotal();
  const showPreview = total > 0;

  const handleSave = () => {
    if (onSave) {
      // Pass both total amount and denominations breakdown
      onSave(total, denominations);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-3 rounded-xl">
                <Wallet className="w-8 h-8 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Opening Cash
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  আজকের ওপেনিং ক্যাশ হিসাব করুন
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-xl border border-gray-200">
              {/* <TrendingUp className="w-5 h-5 text-gray-600" /> */}
              <div>
                <div className="text-xs text-gray-500">Current Balance</div>
                <div className="text-lg font-bold text-gray-800">
                  ৳{openingCash?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  নোট ও কয়েন
                </h2>
                <button
                  onClick={addCustomDenomination}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-xl hover:opacity-90 transition-all duration-300 font-medium text-sm shadow-md"
                  style={{
                    background:
                      "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Custom
                </button>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {denominations.map((denom, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-300 ${
                      denom.enabled ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                        denom.enabled
                          ? "bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
                          : "bg-gray-50 border-2 border-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={denom.enabled}
                        onChange={() => toggleDenomination(index)}
                        className="w-5 h-5 rounded cursor-pointer"
                        style={{ accentColor: "#009C91" }}
                      />

                      {denom.custom ? (
                        <input
                          type="number"
                          value={denom.value}
                          onChange={(e) =>
                            updateCustomValue(index, e.target.value)
                          }
                          className="w-28 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-bold text-gray-700 focus:border-gray-400 focus:outline-none placeholder-gray-400"
                          placeholder="Value"
                          disabled={!denom.enabled}
                          onWheel={(e) => e.target.blur()}
                        />
                      ) : (
                        <div className="w-28 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-bold text-gray-700 text-center shadow-sm">
                          ৳{denom.value}
                        </div>
                      )}

                      <span className="text-gray-400 font-bold text-xl">×</span>

                      <input
                        type="number"
                        value={denom.count === 0 ? "" : denom.count} 
                        onChange={(e) => updateCount(index, e.target.value === "" ? 0 : Number(e.target.value))} 
                        disabled={!denom.enabled}
                        className="w-28 px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg font-bold text-center text-gray-700 focus:border-gray-400 focus:outline-none disabled:opacity-50 disabled:bg-gray-100"
                        min="0"
                        onWheel={(e) => e.target.blur()}
                        placeholder="0"
                      />

                      <span className="text-gray-400 font-bold text-xl">=</span>

                      <div className="flex-1 px-5 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg font-bold text-gray-800 text-lg border border-gray-200 shadow-sm">
                        ৳{(denom.value * denom.count).toLocaleString()}
                      </div>

                      {denom.custom && (
                        <button
                          onClick={() => removeCustomDenomination(index)}
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator
                    className="w-6 h-6"
                    style={{ color: "#009C91" }}
                  />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Summary
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Subtotal</div>
                    <div className="text-3xl font-bold text-gray-800">
                      ৳{subtotal.toLocaleString()}
                    </div>
                  </div>

                  <div
                    className="relative overflow-hidden p-6 rounded-xl shadow-lg"
                    style={{
                      background:
                        "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                    }}
                  >
                    <div className="relative">
                      <div className="text-sm text-white/90 mb-2">
                        Total Opening Cash
                      </div>
                      <div className="text-4xl font-bold text-white">
                        ৳{total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full"
                  style={{
                    background:
                      "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  }}
                ></div>
                Opening Cash Report Preview
              </h2>
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <div className="border-b-2 border-gray-300 pb-6 mb-6">
                  <h3 className="text-center text-2xl font-bold text-gray-800 mb-2">
                    OPENING CASH STATEMENT
                  </h3>
                  <p className="text-center text-gray-600">
                    Date: {new Date().toLocaleDateString("en-GB")}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-gray-800">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 text-gray-700 font-semibold">
                          Denomination
                        </th>
                        <th className="text-center py-3 px-4 text-gray-700 font-semibold">
                          Quantity
                        </th>
                        <th className="text-right py-3 px-4 text-gray-700 font-semibold">
                          Amount (৳)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {denominations
                        .filter((d) => d.enabled && d.count > 0)
                        .map((denom, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <td className="py-3 px-4 font-medium">
                              ৳{denom.value}
                            </td>
                            <td className="text-center py-3 px-4">
                              {denom.count}
                            </td>
                            <td className="text-right py-3 px-4 font-semibold">
                              {(denom.value * denom.count).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t-2 border-gray-400">
                      <tr className="font-bold text-lg">
                        <td className="py-4 px-4 text-gray-700" colSpan="2">
                          TOTAL
                        </td>
                        <td
                          className="py-4 px-4 text-right"
                          style={{
                            background:
                              "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          ৳{total.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSave}
                  disabled={isLoading || total === 0}
                  className="relative px-8 py-4 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Save className="w-6 h-6" />
                    {isLoading ? "Saving..." : "Save Opening Cash"}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default OpeningCashSystem;
