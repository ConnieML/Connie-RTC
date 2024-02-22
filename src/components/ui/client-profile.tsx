import { CRMEntry } from "@/lib/crm/types";
import { useEffect, useState } from "react";

export function ClientProfile({ clientData }: { clientData: CRMEntry }) {
    const [seeMore, setSeeMore] = useState(false);

    const imgUrl = clientData.img_src


    return (
        <article className="flex flex-col justify-between items-center h-full border-2 rounded-sm m-4 p-2">
            <h2 className="text-md py-3">View profile: <span className="text-slate-500">{clientData.name}</span></h2>
            {seeMore && (
                <div className="flex flex-col align-center">
                    <table>
                        <tbody className="text-sm">
                            <tr>
                                <td className="align-top">Notes: </td>
                                <td className="text-slate-500">{clientData.notes} 🖊️</td>
                            </tr>
                            <tr>
                                <td className="align-top" style={{ verticalAlign: "top" }}>Address: </td>
                                <td className="text-slate-500">{clientData.Address}</td>
                            </tr>
                        </tbody>
                    </table>
                    <img src={imgUrl} />
                </div>
            )}
            <div className="text-slate-500">
                {seeMore ? (
                    <button className="border-2 rounded-sm p-1 border-slate-300" onClick={() => setSeeMore(false)}>See Less</button>
                ) : (
                    <button className="border-2 rounded-sm p-1 border-slate-300" onClick={() => setSeeMore(true)}>See More</button>
                )}
            </div>
        </article>
    );
}