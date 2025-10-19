import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import OpeningCashSystem from "../components/OpeningCashSystem/OpeningCashSystem";
import { useOpeningCash } from "../hooks/useOpeningCash";

export default function OpeningCashPage() {
  const navigate = useNavigate();
  const [openingCash, setOpeningCash] = useState(0);
  const [savedDenominations, setSavedDenominations] = useState(null);

  const {
    data: openingCashData,
    isLoading: openingCashLoading,
    mutation: openingCashMutation,
  } = useOpeningCash();

    // DEBUG: Add console logs
  console.log("openingCashData:", openingCashData);
  console.log("openingCashLoading:", openingCashLoading);

  useEffect(() => {
    if (openingCashData) {
      setOpeningCash(openingCashData?.amount || 0);
      // Load saved denominations
      setSavedDenominations(openingCashData?.denominations || null);
    }
  }, [openingCashData]);

  const handleSaveOpeningCash = (totalAmount, denominations) => {
    openingCashMutation.mutate(
      {
        amount: totalAmount,
        denominations: denominations, // Pass denominations to mutation
      },
      {
        onSuccess: () => {
          navigate("/"); // or wherever you want to navigate
        },
      }
    );
  };

  if (openingCashLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <OpeningCashSystem
      openingCash={openingCash}
      savedDenominations={savedDenominations}
      onSave={handleSaveOpeningCash}
      isLoading={openingCashMutation.isPending}
    />
  );
}
