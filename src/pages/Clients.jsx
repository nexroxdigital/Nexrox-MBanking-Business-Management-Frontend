import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ClientsColumns } from "../components/columns/ClientsColumns";
import TableComponent from "../components/shared/Table/Table";
import TableLoading from "../components/shared/TableLoading/TableLoading";
import SingleClientTransaction from "../components/SingleClientTransaction/SingleClientTransaction";
import {
  useAddNewClient,
  useAdjustClientPayment,
  useClients,
  useDeleteClient,
  useUpdateClient,
} from "../hooks/useClient";
import { useToast } from "../hooks/useToast";
import { clamp2 } from "./utils";

export default function Clients() {
  const [isSendMessage, setIsSendMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  const { showError, showSuccess } = useToast();
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  

  const addNewClientMutation = useAddNewClient();
  const deleteClientMutation = useDeleteClient();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editClientId, setEditClientId] = useState(null);
  const [editClient, setEditClient] = useState({ name: "", phone: "" });
  const updateClientMutation = useUpdateClient();

  const [newClient, setNewClient] = useState({
    name: "",
    phone: "",
  });
  const [selected, setSelected] = useState(null);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payClientId, setPayClientId] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const adjustPaymentMutation = useAdjustClientPayment();

  const { data, isLoading, isFetching } = useClients(
    pagination.pageIndex,
    pagination.pageSize
  );

  useEffect(() => {
    if (data?.data) {
      setClients(data?.data); // sync fetched data into state
    }
  }, [data]);

  const openAddModal = () => {
    setNewClient({ name: "", phone: "" });
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  function addClient() {
    // console.log("newClient", newClient);

    if (!newClient.name.trim() || !newClient.phone) return;

    const optimisticClient = {
      _id: Date.now().toString(),
      name: newClient.name.trim(),
      phone: newClient.phone,
      optimistic: true,
    };

    const prevClients = [...clients];

    // 🟢 Optimistic update
    setClients((prev) => [...prev, optimisticClient]);

    // 🔄 Call backend
    addNewClientMutation.mutate(optimisticClient, {
      onSuccess: (savedClient) => {
        // Replace optimistic client with actual one from backend
        setClients((prev) =>
          prev.map((c) => (c._id === optimisticClient._id ? savedClient : c))
        );
      },
      onError: () => {
        //  Rollback on error
        setClients(prevClients);
        Swal.fire("ত্রুটি", "ক্লায়েন্ট যোগ ব্যর্থ হয়েছে!", "error");
      },
      onSettled: () => {
        // Reset modal and input fields
        // setNewClient({ name: "", phone: "" });
        setAddModalOpen(false);
      },
    });
  }

  const deleteClient = (clientId) => {
    console.log("clientId", clientId);
    const client = clients.find((c) => c._id === clientId);

    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: `${client?.name || "এই ক্লায়েন্ট"} ডিলিট হয়ে যাবে!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009C91",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন",
      cancelButtonText: "বাতিল",
    }).then((result) => {
      if (result.isConfirmed) {
        //  Optimistic update
        setClients((prev) => prev.filter((c) => c._id !== clientId));
        if (selected === clientId) setSelected(null);

        //  Call backend
        deleteClientMutation.mutate(clientId, {
          onSuccess: () => {
            Swal.fire({
              title: "ডিলিট হয়েছে!",
              text: "ক্লায়েন্ট সফলভাবে ডিলিট করা হয়েছে।",
              icon: "success",
              showConfirmButton: false,
              timer: 1100,
            });
          },
          onError: () => {
            Swal.fire({
              title: "ভুল হয়েছে!",
              text: "ক্লায়েন্ট ডিলিট করা যায়নি।",
              icon: "error",
            });
          },
        });
      }
    });
  };

  function openEditModal(clientId) {
    const client = clients.find((c) => c._id === clientId);
    if (!client) {
      showError("Client not found");
      return;
    }
    setEditClientId(clientId);

    setEditClient({
      name: client.name,
      phone: client.phone,
    });

    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditClientId(null);
    setEditClient({ name: "", phone: "" });
  }

  function handleUpdateClient() {
    if (!editClient.name.trim() || !editClient.phone) {
      showError("Name and phone are required");
      return;
    }

    console.log("editClient", editClient);

    const prevClients = [...clients];

    // Optimistic update
    setClients((prev) =>
      prev.map((c) =>
        c._id === editClientId
          ? {
              ...c,
              name: editClient.name.trim(),
              phone: editClient.phone,
            }
          : c
      )
    );

    //  Call backend
    updateClientMutation.mutate(
      {
        id: editClientId,
        name: editClient.name.trim(),
        phone: editClient.phone,
      },
      {
        onSuccess: (savedClient) => {
          // Optionally replace optimistic with actual server response
          setClients((prev) =>
            prev.map((c) => (c._id === editClientId ? savedClient : c))
          );

          Swal.fire({
            title: "সফল",
            text: "ক্লায়েন্ট সফলভাবে আপডেট হয়েছে!",
            icon: "success",
            showConfirmButton: false,
            timer: 1100,
          });
        },
        onError: () => {
          // 🔙 Rollback if failed
          setClients(prevClients);
          showError("ক্লায়েন্ট আপডেট ব্যর্থ হয়েছে!");
        },
        onSettled: () => {
          closeEditModal();
        },
      }
    );
  }

  // open pay modal
  const openPayModal = (clientId) => {
    setPayClientId(clientId);
    setPayAmount("");
    setIsSendMessage(false);
    setCustomMessage("");
    setPayModalOpen(true);
  };

  const closePayModal = () => {
    setPayModalOpen(false);
    setPayClientId(null);
    setPayAmount("");
  };

  const submitPayModal = () => {
    const amount = clamp2(payAmount);
    if (!amount || amount <= 0) return;

    // update paid/due
    addPayment(payClientId, amount, isSendMessage, customMessage);

    closePayModal();
  };

  // esc to close
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") {
        if (payModalOpen) closePayModal();
        if (addModalOpen) closeAddModal();
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [payModalOpen, addModalOpen]);

  function addPayment(clientId, amount, isSendMessage, customMessage) {
    const prevClients = [...clients];

    // Optimistic UI update
    setClients((prev) =>
      prev.map((c) => {
        if (c._id !== clientId) return c;

        const newPaid = (c.paid || 0) + Number(amount);
        const newDue = Math.max(0, (c.totalSale || 0) - newPaid);

        return {
          ...c,
          paid: newPaid,
          due: newDue,
        };
      })
    );

    // Backend update
    adjustPaymentMutation.mutate(
      {
        id: clientId,
        amount: Number(amount),
        isSendMessage,
        message: customMessage,
      },
      {
        onSuccess: () => {
          showSuccess(`${amount} টাকা সফলভাবে অ্যাড হয়েছে`);
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "পেমেন্ট ব্যর্থ",
            text: "পেমেন্ট অ্যাড করতে সমস্যা হয়েছে",
          });

          // Rollback UI if API fails
          setClients(prevClients);
        },
      }
    );
  }

  return (
    <section className="grid md:grid-cols-5 gap-6 mt-10">
      {/* Left: Client List */}
      <div className="md:col-span-3 rounded-2xl border border-gray-200 shadow-sm p-0 overflow-hidden">
        {/* Gradient Header */}
        <div
          className="px-3 sm:px-5 py-4 sm:py-4 flex items-center justify-between gap-3 sm:gap-0"
          style={{
            background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
          }}
        >
          <h3 className="font-semibold text-white tracking-wide text-lg md:text-xl sm:text-base">
            ক্লায়েন্ট তালিকা
          </h3>

          <button
            className="px-5 md:px-3 py-2 rounded-xl text-white shadow-sm hover:shadow transition text-sm whitespace-nowrap"
            style={{
              background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
            }}
            onClick={openAddModal}
          >
            ক্লায়েন্ট যোগ করুন
          </button>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-5 bg-white">
          {isLoading ? (
            <TableLoading />
          ) : clients.length < 1 ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ক্লায়েন্ট তালিকা খালি
              </div>
            </div>
          ) : (
            <TableComponent
              data={clients}
              columns={ClientsColumns(
                setSelected,
                openPayModal,
                deleteClient,
                openEditModal
              )}
              pagination={pagination}
              setPagination={setPagination}
              pageCount={data?.pagination?.totalPages ?? -1}
              isFetching={isFetching}
              isLoading={isLoading}
            />
          )}

          {/* Desktop Table Layout */}

          {addModalOpen && (
            <div className="fixed inset-0 z-[125] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/30"
                aria-hidden="true"
                onClick={closeAddModal}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Add client"
                className="relative w-full max-w-sm mx-4 rounded-2xl shadow-xl border bg-white"
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
                    background:
                      "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  }}
                />

                <div className="p-4">
                  <h4 className="font-medium text-gray-900">নতুন ক্লায়েন্ট</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    নাম ও মোবাইল নম্বর দিন।
                  </p>

                  {/* Form*/}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addClient();
                    }}
                    className="mt-4 grid gap-3"
                  >
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        নাম
                      </label>
                      <input
                        autoFocus
                        required
                        type="text"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border border-[#6314698e] focus:ring-2 focus:ring-[#862C8A33]"
                        placeholder="যেমন: Rahim"
                        value={newClient.name}
                        onChange={(e) =>
                          setNewClient((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        মোবাইল নম্বর
                      </label>
                      <input
                        required
                        type="tel"
                        pattern="01[0-9]{9}" // optional BD format
                        title="Valid BD mobile: 11 digits, starts with 01"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border focus:ring-2 border-[#6314698e] focus:ring-[#862C8A33]"
                        placeholder="যেমন: 018XXXXXXXX"
                        value={newClient.phone}
                        onChange={(e) =>
                          setNewClient((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-2 rounded-lg text-red-500 hover:bg-gray-50 border border-red-300 hover:text-red-600 transition cursor-pointer"
                        onClick={closeAddModal}
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition cursor-pointer"
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                        }}
                      >
                        {addNewClientMutation.isPending
                          ? "অপেক্ষা করুন..."
                          : "যোগ করুন"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {payModalOpen && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={closePayModal}
                aria-hidden="true"
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Add payment"
                className="relative w-full max-w-sm mx-4 rounded-2xl shadow-xl border bg-white"
                style={{
                  borderImageSlice: 1,
                  borderImageSource:
                    "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="h-1 w-full rounded-t-2xl"
                  style={{
                    background:
                      "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  }}
                />

                <div className="p-4">
                  <h4 className="font-medium text-gray-900">পেমেন্ট অ্যাড</h4>
                  <p className="text-xs text-gray-500 mt-1">টাকার পরিমাণ দিন</p>

                  <div className="mt-4 grid gap-3">
                    {/* Amount */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        পরিমাণ (৳)
                      </label>
                      <input
                        autoFocus
                        type="number"
                        inputMode="decimal"
                        step="any"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none focus:outline-none border-none"
                        style={{
                          borderImageSlice: 1,
                          borderImageSource:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                          borderWidth: "1px",
                          borderStyle: "solid",
                        }}
                        placeholder="যেমন: 500"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                      />
                    </div>

                    {/* Send message checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        className="w-4 h-4 cursor-pointer accent-[#009C91]"
                        id="message"
                        type="checkbox"
                        checked={isSendMessage}
                        onChange={(e) => {
                          setIsSendMessage(e.target.checked);
                          if (e.target.checked) {
                            setCustomMessage(
                              `প্রিয় গ্রাহক, আপনার টাকা ৳${
                                payAmount || 0
                              } সফলভাবে গ্রহণ করা হয়েছে। ধন্যবাদ।`
                            );
                          } else {
                            setCustomMessage("");
                          }
                        }}
                      />
                      <label
                        htmlFor="message"
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        Send message
                      </label>
                    </div>

                    {/* Message textarea (conditionally shown) */}
                    {isSendMessage && (
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">
                          Message
                        </label>
                        <textarea
                          rows="3"
                          className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border"
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                        onClick={closePayModal}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition disabled:opacity-50"
                        onClick={submitPayModal}
                        disabled={!clamp2(payAmount) || clamp2(payAmount) <= 0}
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {editModalOpen && (
            <div className="fixed inset-0 z-[130] flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/30"
                aria-hidden="true"
                onClick={closeEditModal}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Edit client"
                className="relative w-full max-w-sm mx-4 rounded-2xl shadow-xl border bg-white"
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
                    background:
                      "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                  }}
                />

                <div className="p-4">
                  <h4 className="font-medium text-gray-900">ক্লায়েন্ট আপডেট</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    নাম ও মোবাইল নম্বর আপডেট করুন।
                  </p>

                  {/* Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUpdateClient();
                    }}
                    className="mt-4 grid gap-3"
                  >
                    {/* Name */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        নাম
                      </label>
                      <input
                        autoFocus
                        required
                        type="text"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border border-[#6314698e] focus:ring-2 focus:ring-[#862C8A33]"
                        placeholder="যেমন: Rahim"
                        value={editClient.name}
                        onChange={(e) =>
                          setEditClient((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Number */}
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">
                        মোবাইল নম্বর
                      </label>
                      <input
                        required
                        type="tel"
                        pattern="01[0-9]{9}"
                        title="Valid BD mobile: 11 digits, starts with 01"
                        className="w-full px-3 py-2 rounded-xl bg-white/90 text-gray-900 placeholder-gray-500 outline-none border focus:ring-2 border-[#6314698e] focus:ring-[#862C8A33]"
                        placeholder="যেমন: 018XXXXXXXX"
                        value={editClient.phone}
                        onChange={(e) =>
                          setEditClient((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        className="px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                        onClick={closeEditModal}
                      >
                        বাতিল
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg text-white shadow-sm hover:shadow transition"
                        style={{
                          background:
                            "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
                        }}
                        disabled={updateClientMutation.isPending}
                      >
                        {updateClientMutation.isPending
                          ? "অপেক্ষা করুন..."
                          : "আপডেট করুন"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Client Transactions */}
      <div className="md:col-span-2 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Gradient Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(270deg, #862C8A 0%, #009C91 100%)",
          }}
        >
          <h3 className="font-semibold text-white tracking-wide text-lg md:text-xl">
            ক্লায়েন্টভিত্তিক ট্রান্সাকশন
          </h3>
          {selected && (
            <button
              className="text-xs px-2 py-1 rounded-lg bg-white/90 text-gray-900 hover:bg-white transition"
              onClick={() => setSelected(null)}
            >
              Clear
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5 bg-white max-h-[520px] overflow-y-auto">
          {!selected && (
            <div className="text-gray-700 text-sm">
              বাম পাশ থেকে একটি ক্লায়েন্ট সিলেক্ট করুন
            </div>
          )}

          {selected && <SingleClientTransaction id={selected} />}
        </div>
      </div>
    </section>
  );
}
