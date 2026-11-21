"use client";
import type React from "react";
import { useEffect, useState } from "react";

const fmt = (n:any) => new Intl.NumberFormat("uz-UZ").format(Number(n||0)) + " soʻm";
const dateToday = () => new Date().toLocaleDateString("sv-SE");
async function api(path:string, init?:RequestInit) {
  const r=await fetch(path,{...init,headers:{"Content-Type":"application/json",...(init?.headers||{})}});
  const j=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(j?.error?.message || j?.error?.code || "Xatolik yuz berdi");
  return j.data;
}
function Panel({children,className=""}:{children:React.ReactNode;className?:string}) { return <div className={"qd-panel "+className}>{children}</div> }
function Heading({title,sub,action}:{title:string;sub?:string;action?:React.ReactNode}) {return <header className="qd-head"><div><h1>{title}</h1>{sub&&<p>{sub}</p>}</div>{action}</header>}
function Button({children,onClick,secondary=false}:{children:React.ReactNode;onClick?:()=>void;secondary?:boolean}){return <button onClick={onClick} className={secondary?"qd-btn secondary":"qd-btn"}>{children}</button>}
function Empty({title,desc}:{title:string;desc:string}){return <div className="qd-empty"><span>✦</span><b>{title}</b><p>{desc}</p></div>}
export function StoreDashboard(){
 const [stats,setStats]=useState<any>(null),[customers,setCustomers]=useState<any[]>([]),[loading,setLoading]=useState(true),[err,setErr]=useState("");
 useEffect(()=>{Promise.all([api("/api/stats"),api("/api/customers")]).then(([s,c])=>{setStats(s);setCustomers(c||[])}).catch(e=>setErr(e.message)).finally(()=>setLoading(false))},[]);
 const remaining=stats?.remaining ?? stats?.total_remaining ?? stats?.outstanding ?? 0;
 const overdue=stats?.overdue ?? stats?.overdue_amount ?? 0;
 const collected=stats?.collected ?? stats?.total_collected ?? stats?.paid ?? 0;
 const totalClients=stats?.customers_count ?? stats?.customer_count ?? customers.length;
 const top=[...customers].sort((a,b)=>Number(b.remaining||0)-Number(a.remaining||0)).filter(c=>Number(c.remaining||0)>0).slice(0,5);
 return <main className="qd-page">
  <Heading title="Bosh sahifa" sub="Bugungi savdo va qarzlar holati"/>
  <div className="qd-welcome"><div><span className="qd-eyebrow">QARZDAFTAR</span><h2>Hisob-kitoblar<br/>tartibda boʻlsin.</h2><p>Mijozlar qarzini kuzatish endi oson.</p></div><img src="/brand/qarzdaftar-mark.svg" alt="QarzDaftar" className="h-16 w-16 shrink-0 rounded-2xl" /></div>
  {err&&<div className="qd-alert">{err}</div>}
  <div className="qd-stats">
   <Panel className="qd-stat primary"><span>Jami qarz qoldigʻi</span><strong>{loading?"…":fmt(remaining)}</strong><small>Hozir undirilishi kerak</small></Panel>
   <Panel className="qd-stat"><span>Toʻlangan</span><strong>{loading?"…":fmt(collected)}</strong><small>Jami tushum</small></Panel>
   <Panel className="qd-stat warn"><span>Muddati oʻtgan</span><strong>{loading?"…":fmt(overdue)}</strong><small>Qayta eslatish kerak</small></Panel>
   <Panel className="qd-stat"><span>Mijozlar</span><strong>{loading?"…":fmt(totalClients)}</strong><small>Roʻyxatdagi mijozlar</small></Panel>
  </div>
  <Panel><div className="qd-section-title"><h2>Koʻp qarzdor mijozlar</h2><a href="/app/customers">Hammasi →</a></div>
   {top.length?top.map((c,i)=><div className="qd-row" key={c.customer_id||c.id}><div className="qd-avatar">{(c.full_name||"?").slice(0,1).toUpperCase()}</div><div className="qd-row-main"><b>{c.full_name}</b><small>{c.phone||"Telefon kiritilmagan"}</small></div><strong className="qd-money">{fmt(c.remaining)}</strong></div>):!loading&&<Empty title="Hozircha qarzlar yoʻq" desc="Mijoz qoʻshing va qarzlarni qayd etishni boshlang."/>}
  </Panel>
  <div className="qd-quick"><a href="/app/customers"><span>＋</span><b>Mijoz qoʻshish</b><small>Yangi mijoz yaratish</small></a><a href="/app/debts"><span>↗</span><b>Qarz yozish</b><small>Yangi qarz qayd etish</small></a></div>
 </main>
}
export function CustomersScreen(){
 const [list,setList]=useState<any[]>([]),[query,setQuery]=useState(""),[loading,setLoading]=useState(true),[error,setError]=useState(""),[open,setOpen]=useState(false),[name,setName]=useState(""),[phone,setPhone]=useState(""),[note,setNote]=useState(""),[saving,setSaving]=useState(false);
 async function load(q= query){setLoading(true);try{setList(await api("/api/customers?q="+encodeURIComponent(q))||[]);setError("")}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load("")},[]);
 const total=list.reduce((s,c)=>s+Number(c.remaining||0),0);
 async function add(){setSaving(true);setError("");try{const rawPhone=phone.replace(/[^0-9+]/g,"");const normalizedPhone=rawPhone?(rawPhone.startsWith("+")?rawPhone:rawPhone.startsWith("998")?"+"+rawPhone:rawPhone.length===9?"+998"+rawPhone:rawPhone):undefined;await api("/api/customers",{method:"POST",body:JSON.stringify({full_name:name.trim(),phone:normalizedPhone,note:note.trim()||undefined})});setName("");setPhone("");setNote("");setOpen(false);await load("")}catch(e:any){setError(e.message)}finally{setSaving(false)}}
 return <main className="qd-page"><Heading title="Mijozlar" sub="Mijozlarni toping va hisobini boshqaring" action={<Button onClick={()=>setOpen(true)}>＋ Qoʻshish</Button>}/>
 <Panel className="qd-customer-summary"><div><small>Mijozlar soni</small><b>{fmt(list.length)}</b></div><div><small>Qarz qoldigʻi</small><b>{fmt(total)}</b></div></Panel>
 <div className="qd-search"><span>⌕</span><input value={query} placeholder="Ism yoki telefon orqali qidirish" onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load(query)}/><button onClick={()=>load(query)}>Qidirish</button></div>
 {error&&<div className="qd-alert">{error}</div>}
 <Panel className="qd-list-panel"><div className="qd-section-title"><h2>Roʻyxat</h2><small>{list.length} ta</small></div>
 {loading?<p className="qd-muted p-4">Yuklanmoqda…</p>:list.length?list.map(c=><a className="qd-row customer" href={"/app/debts?customer="+encodeURIComponent(c.customer_id)} key={c.customer_id}><div className="qd-avatar">{(c.full_name||"?").slice(0,1).toUpperCase()}</div><div className="qd-row-main"><b>{c.full_name}</b><small>{c.phone||"Telefon yoʻq"} · {Number(c.overdue)>0?"Muddati oʻtgan":"Hisob holati"}</small></div><div className="qd-row-end"><strong className={Number(c.remaining)>0?"qd-money":"qd-positive"}>{fmt(c.remaining)}</strong><small>Qoldiq ›</small></div></a>):<Empty title="Mijoz topilmadi" desc="Qidiruvni oʻzgartiring yoki yangi mijoz qoʻshing."/>}
 </Panel>
 {open&&<div className="qd-modal-back" onClick={()=>setOpen(false)}><div className="qd-modal" onClick={e=>e.stopPropagation()}><div className="qd-section-title"><h2>Yangi mijoz</h2><button className="qd-close" onClick={()=>setOpen(false)}>×</button></div><label>Ism va familiya<input autoFocus value={name} onChange={e=>setName(e.target.value)} placeholder="Masalan: Ali Valiyev"/></label><label>Telefon raqami<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+998901234567" type="tel"/></label><label>Izoh (ixtiyoriy)<textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Mijoz haqida eslatma"/></label>{error&&<div className="qd-alert">{error}</div>}<Button onClick={add}>{saving?"Saqlanmoqda…":"Mijozni saqlash"}</Button></div></div>}
 </main>
}
export function DebtsScreen(){
 const [debts,setDebts]=useState<any[]>([]),[customers,setCustomers]=useState<any[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[status,setStatus]=useState("open"),[newOpen,setNewOpen]=useState(false),[payDebt,setPayDebt]=useState<any>(null),[customer,setCustomer]=useState(""),[amount,setAmount]=useState(""),[due,setDue]=useState(""),[comment,setComment]=useState(""),[payAmount,setPayAmount]=useState(""),[saving,setSaving]=useState(false);
 async function load(){setLoading(true);try{const [d,c]=await Promise.all([api("/api/debts?status="+status),api("/api/customers")]);setDebts(d||[]);setCustomers(c||[]);setError("")}catch(e:any){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[status]);
 const sum=debts.reduce((a,d)=>a+Number(d.remaining_amount??d.remaining??0),0);
 async function create(){setSaving(true);try{await api("/api/debts",{method:"POST",body:JSON.stringify({customer_id:customer,amount:Number(amount),due_on:due,comment:comment||undefined})});setNewOpen(false);setCustomer("");setAmount("");setDue("");setComment("");await load()}catch(e:any){setError(e.message)}finally{setSaving(false)}}
 async function payment(){setSaving(true);try{await api(`/api/debts/${payDebt.id}/payments`,{method:"POST",body:JSON.stringify({amount:Number(payAmount),method:"cash",paid_on:dateToday()})});setPayDebt(null);setPayAmount("");await load()}catch(e:any){setError(e.message)}finally{setSaving(false)}}
 return <main className="qd-page"><Heading title="Qarzlar" sub="Qarzlarni qayd qiling va toʻlovlarni kuzating" action={<Button onClick={()=>setNewOpen(true)}>＋ Qarz qoʻshish</Button>}/>
 <Panel className="qd-customer-summary"><div><small>Filtrdagi qarzlar</small><b>{fmt(sum)}</b></div><div><small>Qarzlar soni</small><b>{debts.length}</b></div></Panel>
 <div className="qd-tabs">{[["open","Aktiv"],["partial","Qisman toʻlangan"],["paid","Yopilgan"],["cancelled","Bekor qilingan"]].map(([v,l])=><button className={status===v?"active":""} onClick={()=>setStatus(v)} key={v}>{l}</button>)}</div>
 {error&&<div className="qd-alert">{error}</div>}
 <Panel className="qd-list-panel">{loading?<p className="qd-muted p-4">Yuklanmoqda…</p>:debts.length?debts.map(d=><div className="qd-debt-card" key={d.id}><div className="qd-row"><div className="qd-avatar">{(d.customer?.full_name||"M").slice(0,1).toUpperCase()}</div><div className="qd-row-main"><b>{d.customer?.full_name||"Mijoz"}</b><small>Berilgan: {d.issued_on} · Muddat: {d.due_on}</small></div><span className={"qd-pill "+d.status}>{d.status==="open"?"Aktiv":d.status==="partial"?"Qisman":d.status==="paid"?"Yopilgan":"Bekor"}</span></div><div className="qd-debt-amounts"><div><small>Qarz miqdori</small><b>{fmt(d.amount)}</b></div><div><small>Qoldiq</small><b className="qd-money">{fmt(d.remaining_amount)}</b></div></div>{d.comment&&<p className="qd-note">{d.comment}</p>}{["open","partial"].includes(d.status)&&<Button secondary onClick={()=>{setPayDebt(d);setPayAmount(String(d.remaining_amount||0))}}>Toʻlov kiritish</Button>}</div>):<Empty title="Qarzlar yoʻq" desc="Yangi qarz qoʻshish tugmasi orqali boshlang."/>}</Panel>
 {newOpen&&<div className="qd-modal-back" onClick={()=>setNewOpen(false)}><div className="qd-modal" onClick={e=>e.stopPropagation()}><div className="qd-section-title"><h2>Yangi qarz</h2><button className="qd-close" onClick={()=>setNewOpen(false)}>×</button></div><label>Mijoz<select value={customer} onChange={e=>setCustomer(e.target.value)}><option value="">Mijozni tanlang</option>{customers.map(c=><option key={c.customer_id} value={c.customer_id}>{c.full_name} — {c.phone||""}</option>)}</select></label><label>Qarz summasi (soʻm)<input inputMode="numeric" value={amount} onChange={e=>setAmount(e.target.value.replace(/\D/g,""))} placeholder="100000"/></label><label>Toʻlash muddati<input type="date" value={due} onChange={e=>setDue(e.target.value)} min={dateToday()}/></label><label>Izoh<textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Ixtiyoriy"/></label><Button onClick={create}>{saving?"Saqlanmoqda…":"Qarzni saqlash"}</Button></div></div>}
 {payDebt&&<div className="qd-modal-back" onClick={()=>setPayDebt(null)}><div className="qd-modal" onClick={e=>e.stopPropagation()}><div className="qd-section-title"><h2>Toʻlov kiritish</h2><button className="qd-close" onClick={()=>setPayDebt(null)}>×</button></div><p className="qd-muted">{payDebt.customer?.full_name} · Qoldiq: {fmt(payDebt.remaining_amount)}</p><label>Toʻlov summasi<input inputMode="numeric" value={payAmount} onChange={e=>setPayAmount(e.target.value.replace(/\D/g,""))}/></label><Button onClick={payment}>{saving?"Saqlanmoqda…":"Toʻlovni saqlash"}</Button></div></div>}
 </main>
}
