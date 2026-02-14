"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, Activity, DollarSign, Settings } from "lucide-react";

export default function AssetTracker({ theme = "dark", isPreview = false }) {
    const t = useTranslations("AssetTracker");
    const locale = useLocale();
    const isDark = theme === "dark";

    const [assets, setAssets] = useState([
        { id: "bitcoin", name: t("bitcoin"), price: 0, change: 0, icon: "₿" },
        { id: "ethereum", name: t("ethereum"), price: 0, change: 0, icon: "Ξ" },
        { id: "gold", name: t("gold"), price: 2650.45, change: 0.85, icon: "Au" }
    ]);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);

    const fetchPrices = useCallback(async () => {
        if (isPreview) return;
        setLoading(true);
        try {
            // Fetch Crypto via CoinGecko
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true");
            const data = await response.json();

            setAssets(prev => prev.map(asset => {
                if (data[asset.id]) {
                    return {
                        ...asset,
                        price: data[asset.id].usd,
                        change: data[asset.id].usd_24h_change
                    };
                }
                return asset;
            }));
            setLastUpdate(new Date().toLocaleTimeString());
        } catch (error) {
            console.error("Failed to fetch asset prices:", error);
        } finally {
            setLoading(false);
        }
    }, [isPreview]);

    useEffect(() => {
        if (isPreview) {
            setAssets([
                { id: "bitcoin", name: t("bitcoin"), price: 65432.10, change: 2.45, icon: "₿" },
                { id: "ethereum", name: t("ethereum"), price: 3456.78, change: -1.2, icon: "Ξ" }
            ]);
            return;
        }

        fetchPrices();
        const interval = setInterval(fetchPrices, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [isPreview, t, fetchPrices]);

    const containerClasses = isDark
        ? "bg-neutral-900/80 border-neutral-800 text-white"
        : "bg-white/80 border-gray-200 text-black";

    if (isPreview) {
        return (
            <div className={`relative overflow-hidden rounded-2xl border p-4 w-full scale-90 origin-top shadow-lg ${containerClasses}`}>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t("live")}</span>
                    </div>
                    <h3 className="text-lg font-bold tracking-tighter uppercase leading-none">{t("title")}</h3>
                </div>
                <div className="space-y-2">
                    {assets.slice(0, 2).map((asset) => (
                        <div key={asset.id} className="flex justify-between items-center text-xs">
                            <span className="text-neutral-500">{asset.name}</span>
                            <span className="font-mono text-main">${asset.price.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden rounded-3xl border p-6 shadow-2xl backdrop-blur-md transition-all duration-500 w-full max-w-full mx-auto min-h-[300px] flex flex-col ${containerClasses}`}>
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #d7b180 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-main/10 text-main">
                            <Activity size={20} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold tracking-tighter uppercase leading-none">{t("title")}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">{t("live")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.open(`/${locale}/tools/asset-tracker`, '_blank')}
                            className="p-2 hover:bg-neutral-800/50 rounded-xl transition-colors text-neutral-500 hover:text-white cursor-pointer"
                        >
                            <Settings size={18} />
                        </button>
                        <button
                            onClick={fetchPrices}
                            disabled={loading}
                            className={`p-2 hover:bg-neutral-800/50 rounded-xl transition-all cursor-pointer ${loading ? "animate-spin text-main" : "text-neutral-500 hover:text-white"}`}
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {assets.map((asset) => (
                        <motion.div
                            key={asset.id}
                            layout
                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isDark ? "bg-neutral-800/40 border-neutral-800" : "bg-gray-50 border-gray-100"}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${isDark ? "bg-neutral-700/50 text-neutral-400" : "bg-white text-neutral-500"}`}>
                                    {asset.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm leading-none mb-1">{asset.name}</h4>
                                    <p className="text-[10px] text-neutral-500 uppercase font-medium">{asset.id.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-mono font-bold text-lg tracking-tight leading-none mb-1">
                                    <DollarSign size={14} className="inline mr-0.5 opacity-50" />
                                    {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                                <div className={`flex items-center justify-end gap-1 text-[10px] font-bold ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                                    {asset.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                    {Math.abs(asset.change).toFixed(2)}%
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-8 text-[10px] text-neutral-500 opacity-50 uppercase tracking-widest px-1">
                    <span>{t("poweredBy")} CoinGecko</span>
                    {lastUpdate && <span>{lastUpdate}</span>}
                </div>
            </div>
        </div>
    );
}
