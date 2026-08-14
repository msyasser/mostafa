"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import enLabels from "react-phone-number-input/locale/en.json";
import arLabels from "react-phone-number-input/locale/ar.json";
import { ChevronDown, Search, Check } from "lucide-react";
import { useLocale } from "next-intl";

export default function CustomPhoneInput({
  value = "",
  onChange,
  defaultCountry = "EG",
  placeholder,
  required,
  id = "phone",
  name = "phone",
}) {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const labels = isArabic ? arLabels : enLabels;

  const [country, setCountry] = useState(defaultCountry);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Calling code for the selected country
  const callingCode = useMemo(() => {
    try {
      return getCountryCallingCode(country);
    } catch {
      return "20";
    }
  }, [country]);

  // Extract phone number without the country prefix for display in input
  const getDisplayNumber = (val, code) => {
    if (!val) return "";
    const prefix = `+${code}`;
    if (val.startsWith(prefix)) {
      return val.slice(prefix.length).trim();
    }
    return val;
  };

  const [nationalNumber, setNationalNumber] = useState(() =>
    getDisplayNumber(value, callingCode)
  );

  // Sync national number if value is changed externally (e.g. form reset or autofill)
  useEffect(() => {
    const display = getDisplayNumber(value, callingCode);
    setNationalNumber(display);
  }, [value, callingCode]);

  // Close dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Build sorted country list
  const countries = useMemo(() => {
    const rawCountries = getCountries();
    return rawCountries
      .map((c) => {
        let code = "1";
        try {
          code = getCountryCallingCode(c);
        } catch {}
        return {
          code: c,
          name: labels[c] || c,
          callingCode: `+${code}`,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, isArabic ? "ar" : "en"));
  }, [labels, isArabic]);

  // Filter countries by name or calling code
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const query = searchQuery.toLowerCase().trim();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.callingCode.includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [countries, searchQuery]);

  const handleSelectCountry = (newCountry) => {
    setCountry(newCountry);
    setIsOpen(false);
    setSearchQuery("");
    let newCode = "20";
    try {
      newCode = getCountryCallingCode(newCountry);
    } catch {}

    if (nationalNumber) {
      onChange?.(`+${newCode} ${nationalNumber.trim()}`);
    } else {
      onChange?.(`+${newCode}`);
    }
  };

  const handleNumberChange = (e) => {
    const val = e.target.value;
    setNationalNumber(val);
    if (val.trim()) {
      onChange?.(`+${callingCode} ${val.trim()}`);
    } else {
      onChange?.("");
    }
  };

  const SelectedFlag = flags[country];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input container */}
      <div
        className={`relative flex items-center w-full bg-[#141414] rounded-xl border transition-all duration-200 min-h-[52px] px-3 ${
          isOpen
            ? "border-main ring-1 ring-main/30 shadow-[0_0_20px_rgba(215,177,128,0.15)]"
            : "border-neutral-800 hover:border-neutral-700 focus-within:border-main focus-within:ring-1 focus-within:ring-main/30"
        }`}
      >
        {/* Custom Country Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-neutral-900/90 hover:bg-neutral-800/80 border border-neutral-800/80 transition-colors cursor-pointer group flex-shrink-0"
        >
          <div className="w-5 h-3.5 rounded-[2px] overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0">
            {SelectedFlag ? (
              <SelectedFlag title={labels[country]} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-neutral-400 font-mono">{country}</span>
            )}
          </div>
          <span className="text-xs font-mono text-neutral-300 font-medium tracking-tight">
            +{callingCode}
          </span>
          <ChevronDown
            size={13}
            className={`text-neutral-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-main" : "group-hover:text-neutral-200"
            }`}
          />
        </button>

        {/* Subtle Divider */}
        <div className="w-[1px] h-5 bg-neutral-800 mx-2.5 flex-shrink-0" />

        {/* Phone Input */}
        <input
          id={id}
          name={name}
          type="tel"
          value={nationalNumber}
          onChange={handleNumberChange}
          placeholder={placeholder || (isArabic ? "010 1234 5678" : "100 123 4567")}
          required={required}
          className="flex-1 bg-transparent border-0 outline-none text-white text-sm sm:text-base placeholder:text-neutral-500 py-3 focus:outline-none focus:ring-0 w-full min-w-0"
          style={{
            direction: "ltr",
            textAlign: isArabic ? "right" : "left",
          }}
        />
      </div>

      {/* Custom Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-neutral-900/95 backdrop-blur-2xl border border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-neutral-800/80 bg-neutral-950/50">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isArabic ? "ابحث عن الدولة أو الرمز..." : "Search country or code..."}
                className="w-full pl-9 pr-3 py-2 bg-neutral-900 text-white text-xs sm:text-sm rounded-xl border border-neutral-800 focus:outline-none focus:border-main focus:ring-1 focus:ring-main/30 placeholder:text-neutral-500 transition-all"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => {
                const Flag = flags[c.code];
                const isSelected = c.code === country;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectCountry(c.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? "bg-main/15 text-main font-medium border border-main/20"
                        : "text-neutral-300 hover:bg-neutral-800/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-5 h-3.5 rounded-[2px] overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 border border-neutral-700/50">
                        {Flag ? (
                          <Flag title={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-neutral-400">{c.code}</span>
                        )}
                      </div>
                      <span className="truncate">{c.name}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-main/20 text-main"
                            : "bg-neutral-800/80 text-neutral-400"
                        }`}
                      >
                        {c.callingCode}
                      </span>
                      {isSelected && <Check size={14} className="text-main" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-neutral-500">
                {isArabic ? "لم يتم العثور على نتائج" : "No countries found"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
