import React, {useState, useEffect, useContext} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap, Polyline} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import {decode} from "@googlemaps/polyline-codec";

const MbtaMap = () => {
    const enc_polyline = "euqaGrkvpLGFG@O@MBIDgAhAqBpBuAnA]^kAlBUb@i@z@_BbCSXEJEHm@bAGLGHqAtBk@|@oEdHCBABEF}@rA]j@]f@y@jAIJMNGFm@t@sVn[{@dA]`@u@n@YV]T{@f@w@XuAb@}@NYFg@F]H{@B[?s@?cBOiBAiAAeBAq@A??{@?{@A_@?{PM_EJq@?}@CuA?oFCw@Am@Ck@Go@Im@Mu@Qq@So@Uq@]u@c@w@i@]Yi@c@]_@cAoAc@o@u@kA_C_Es@qAiB{CkBmCcAqAmFuGsCoDqCiD{AkBqA}A}AkB}@kAmAkBa@w@c@aA]{@Yy@YaAU{@c@mBO{@_@iCU_CEu@AQASEw@Am@AS?UAu@AoBB_BLgDJqAJaARwAVaB^cB`@_BlAmEf@gBd@eBd@aBhD}LXaAp@qC`@}BRqANoA~@}H`AeIp@}F\\oCXkCR{Bb@uC^_DZoC`AeIn@oFZwCDWHo@BQL}@NsA??h@uELiABSBQbAiIV{BDe@D_@JgAHyAF_EAaBE_BOgCSwB_@oC_@qB]sA[iAo@oBu@mBmCkHkA{CoE}LgB{EsBmFq@iBaDgIAGCE}AmEoBsF}@cCqAiD{@wBaE}KCKCIKWkBcFkB{Ew@cBS[GMKOa@o@g@s@k@q@wBwBiA}@[USQ{BiB}BcByAaAkDaCe@[??g@_@uGqEiD}B}DqCwE_DmFuDqLaIcFoDMKAAMI{ByAyLsI_PsKcJiGwHkFoGmEaMoImXiRoXgRwPiLu@e@qFuDcGeEiCgBaC}AkJuGkA{@mB_BmAgAgAeAIK??cBgByAaBaAkAaC}CyBcDw@iAqBiDy@yA{@aBw@{Aw@iBcAeCy@qBs@eB{A{DsAwDmBgFKSIUGMaAyCaHiRaDaJmAgD_@}@mAcDgBaFw@cCi@cB}@oCs@qBKUM[mAgD[{@??kBcFoAgDa@gAyBeGcAuCy@{B_DaIo@iBGOGOgDgJaBsEOa@iBcFOa@]_A{@{ByCkIWq@kAeDgAwCuAyDwGwQmAmDa@eAg@{A}@yBw@gB_BaD??MY}@}AKS_AaByAcCIK}@sAuAkBW_@YYY_@y@}@[[e@g@WW_CyBgA}@iCmBq@a@g@]c@Yo@c@KEKGQI[O]Qc@Sm@YSKw@]}@[oBq@y@WaBa@gBa@qBc@}A[yA]u@QeA[qAc@oAc@cBq@qB_Ag@YoCaB_C}Ao@g@]Y[W}@w@u@q@wHcHyAsAcGqFc@a@k@i@m@g@_BqA}AgAm@a@{A}@mAq@_CkAuDyBqF{CeE{B_YqOIEGESKuGoDcDkBcE{BwGmDk@QsB{@y@Yi@Mm@Mk@Go@MeA?{@CI?sA@mDWiQkAmFe@cAIq@GkE]]?qTLaJDmA@S?M?G?cAI}@O????gAYo@Ue@SgBiAqCgB_CwAyBuAwAaAe@WwH}EgAq@sEyCiC}AqCsAYMIEGCk@Sa@O{Ae@oCs@{A[}A]iBg@sAYkEeAuG_B_LmCoG}AoD_AICKCaDq@yD_A{Bi@aBYeDg@??s@MaBM{AMaIWmB@qF@e@?kD@yACyAUoBe@_BgAkAwAWm@_BmBwAmBoBsCoBaDcB{C{AwCy@gBoB{EsAuDeAkDcAqD}@kDs@{CmB_JoBwJI_@??y@{Dw@mDqE_TkAeG[eBo@wEy@gIOmBScE_@iM_@iPS}GCoA?kCBoBByAHiBFy@^_EL_A\\mB\\gB`@wAl@qBrAaEvCkIt@qBj@}ArCuHvBmFxC{HtAgDt@uBb@wA\\uATgA\\gBR{ARwANmBHqADkBBoCCoBA{@MeCM{BOgBs@{Kc@kG??QeCAOM}Aw@}LYkEmAkO[mDeBeQw@sHIkAQsAUyB??c@iEwAsMi@yFm@sFSkBe@cE[mD{@qIg@_FKu@yCaZUuBYaCYsCYgCM{AUyCIuCO_GOuE]kIGyAKmAUiCMeAa@}Ba@qBc@_B[q@IYCKAIAOQm@GMo@qAaAeBo@cASY}@gAkDyCmCeC{@aA}@mAmAsBGK[m@_@w@k@{Ae@yAo@wB_@{AsA_FaAuDaAyDIWy@wC}BuIaA_EEM??Og@}@yDUoA_@{Bc@yDYoCKaBMw@aA}J_@yDMqAOeAUcBg@kCOq@c@}A[cAc@kAmAyCo@sAw@oAa@q@eB{CeByCkCsEmBkDgCmEiCyEi@aAy@iBq@mBUs@Qk@g@sBc@_C_@aC]oCmAqJc@yC_@wBe@uBm@sB{@sB}@qB_AkBcAkBkFmKyA}Cm@iAGK_AgBmFuKiDaHeBgDkAuByBkEeAwBaAkBo@qAm@mAeAmBsBcD_B{By@eAsBeC}BqCiE_Fot@my@qA{Aa@e@eAuAa@m@}@}Aq@{AUq@uAmDo@yAq@oA]m@m@}@q@aAu@{@q@u@m@k@oAcAi@_@_Ao@sDmCs@q@a@a@WWg@m@mB_C??_HmI{@gAk@w@g@u@_@q@c@}@c@cAe@mAWy@K[Qo@U{@[cBMm@Ks@K_AK_Ae@iGa@{FAQcBcTU_Ck@uEgBuLc@_D_@iDS}BGwAEaCGeHWu`@?gAMkPCeD?y@@cA@aAFy@H{@VsB@K@GJ}@VcBjBcMh@eE??DWZuBJ{@Dy@B}@?o@Aq@KwAKg@EOQm@Qg@g@cAs@}@[_@GCc@YYOc@MeAKa@?qFD_PRwHDG?E?a@@i@?O?S?S?o@G_@G[Iy@YYM[Sw@i@s@q@q@{@U]O[Q]eD_IcFcMiLeYs@oBi@iBgAmE_AsD]iA_@kAg@iAq@qAaAcB_AuAoCgEy@{Au@yA_@}@aDoHmHoQyCcH_CuFoCuGoAsBsAiB_B{AkBoAcB{@_L_FaDsAsBm@cC_@qCScCOoCU_BW}Ac@cAe@OIcAm@kAy@gAgAsA{AoA{AUYeAkAiHoI]a@cCoCoAuAuAwAuEaF";
    const dec_polyline = decode(enc_polyline);
    return (
        <div className="map">
            <MapContainer center={[42.359149, -71.0581643]} zoom={10} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}"
                    ext="png"
                    minZoom={8}
                />
                <Polyline positions={dec_polyline} pathOptions={{color: "purple"}}/>
            </MapContainer>
        </div>
    )
}

export default MbtaMap