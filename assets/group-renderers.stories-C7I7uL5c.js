import{j as d}from"./iframe-CJs7U6I_.js";import{R as p,I as $,E as G}from"./renderer-D8fIws__.js";import{a as q,b as l,c as E,m as F}from"./helpers-CuNbfLvO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CteRK0s8.js";import"./index-Dv4SGy_Z.js";import"./index-BZmF1yFM.js";function a(e){const n=[...e.extensions??[]];return e.control&&n.push({url:G.ITEM_CONTROL,valueCodeableConcept:{coding:[{system:$,code:e.control}]}}),{linkId:e.linkId,text:e.text,type:"group",repeats:e.repeats,readOnly:e.readOnly,extension:n.length>0?n:void 0,item:e.item&&e.item.length>0?e.item:void 0}}const j=[l({linkId:"first-name",text:"First name",type:"string",control:"text-box"}),l({linkId:"age",text:"Age",type:"integer",control:"spinner"})],B=[{linkId:"header-story-note",text:"Please review the following information before you start. This header stays visible so you can always see the clinic name, visit context, and any time-sensitive instructions while you complete the form.",type:"display"}],z=[{linkId:"footer-story-note",text:"If you need help, contact the front desk or pause and return later. This footer remains visible so you can quickly find support details and consent reminders at any point.",type:"display"}];function x(e,n){const t=(r,o,i,s)=>l({linkId:`${e}-${r}`,text:o,type:i,control:s});switch(n){case"Demographics":return[t("first-name","First name","string","text-box"),t("last-name","Last name","string","text-box"),t("date-of-birth","Date of birth","date"),t("sex-at-birth","Sex at birth","string","text-box"),t("mobile-phone","Mobile phone","string","text-box"),t("email","Email","string","text-box")];case"Current medications":return[t("medication-name","Medication name","string","text-box"),t("dose-mg","Dose (mg)","integer","spinner"),t("frequency","Frequency","string","text-box"),t("route","Route","string","text-box"),t("start-date","Start date","date"),t("still-taking","Still taking","boolean","check-box")];case"Intake details":return[t("reason-for-visit","Reason for visit","text","text-box"),t("symptom-onset","Symptom onset","date"),t("pain-level","Pain level (0-10)","integer","spinner"),t("temperature","Temperature (C)","decimal"),t("visit-type","Visit type","string","text-box"),t("consent-to-treat","Consent to treatment","boolean","check-box")];case"Medical history":return[t("allergies","Allergies","text","text-box"),t("chronic-conditions","Chronic conditions","text","text-box"),t("past-surgeries","Past surgeries","text","text-box"),t("family-history","Family history","text","text-box"),t("tobacco-use","Tobacco use","string","text-box"),t("alcohol-use","Alcohol use","string","text-box")];case"Care plan":return[t("primary-goal","Primary goal","text","text-box"),t("target-date","Target date","date"),t("assigned-clinician","Assigned clinician","string","text-box"),t("follow-up","Follow-up interval","string","text-box"),t("needs-referral","Needs referral","boolean","check-box"),t("care-plan-notes","Care plan notes","text","text-box")];default:return[t("details","Details","text","text-box"),t("notes","Additional notes","text","text-box"),t("follow-up-needed","Follow-up needed","boolean","check-box")]}}const D=["string","text","integer","decimal","boolean","date","dateTime","time","url","coding","reference","attachment","quantity"],N=[{linkId:"taste",text:"Taste"},{linkId:"color",text:"Color"},{linkId:"size",text:"Size"},{linkId:"shape",text:"Shape"},{linkId:"texture",text:"Texture"}],U=[{linkId:"grid-string",text:"String",type:"string"},{linkId:"grid-text",text:"Text",type:"text"},{linkId:"grid-integer",text:"Integer",type:"integer"},{linkId:"grid-decimal",text:"Decimal",type:"decimal"},{linkId:"grid-boolean",text:"Boolean",type:"boolean"},{linkId:"grid-date",text:"Date",type:"date"},{linkId:"grid-date-time",text:"DateTime",type:"dateTime"},{linkId:"grid-time",text:"Time",type:"time"},{linkId:"grid-url",text:"URL",type:"url"},{linkId:"grid-coding",text:"Coding",type:"coding"},{linkId:"grid-reference",text:"Reference",type:"reference"},{linkId:"grid-attachment",text:"Attachment",type:"attachment"},{linkId:"grid-quantity",text:"Quantity",type:"quantity"}],g=["Morning","Afternoon","Evening"],b={exact:[["Alpha","Bravo","Charlie","Delta","Echo"],["Alpha","Bravo","Charlie","Delta","Echo"],["Alpha","Bravo","Charlie","Delta","Echo"],["Alpha","Bravo","Charlie","Delta","Echo"],["Alpha","Bravo","Charlie","Delta","Echo"]],overlap:[["Red","Blue","Green","Yellow","Purple"],["Blue","Green","Yellow","Purple","Orange"],["Green","Yellow","Purple","Orange","Teal"],["Yellow","Purple","Orange","Teal","Cyan"],["Purple","Orange","Teal","Cyan","Magenta"]],sparse:[["Sweet","Salty","Sour","Bitter","Umami"],["Circle","Square","Triangle","Hexagon","Star"],["Small","Medium","Large","XL","XXL"],["Hot","Cold","Warm","Cool","Icy"],["North","South","East","West","Center"]]},w={exact:[[10,20,30,40,50],[10,20,30,40,50],[10,20,30,40,50],[10,20,30,40,50],[10,20,30,40,50]],overlap:[[1,2,3,4,5],[3,4,5,6,7],[5,6,7,8,9],[7,8,9,10,11],[9,10,11,12,13]],sparse:[[10,11,12,13,14],[20,21,22,23,24],[30,31,32,33,34],[40,41,42,43,44],[50,51,52,53,54]]},H={exact:[[!0,!1],[!0,!1],[!0,!1],[!0,!1],[!0,!1]],overlap:[[!0,!1],[!0,!1],[!0,!1],[!0,!1],[!0,!1]],sparse:[[!0,!1],[!0,!1],[!0,!1],[!0,!1],[!0,!1]]};function Q(e){return e.toLowerCase().replaceAll(/[^a-z0-9]+/g,"-").replaceAll(/^-+|-+$/g,"")}function C(e){return String(e).padStart(2,"0")}function y(e,n){return{exact:e.exact.map((t,r)=>t.map((o,i)=>n(o,r,i))),overlap:e.overlap.map((t,r)=>t.map((o,i)=>n(o,r,i))),sparse:e.sparse.map((t,r)=>t.map((o,i)=>n(o,r,i)))}}function A(e,n){return{exact:e.exact.map((t,r)=>n(t,r)),overlap:e.overlap.map((t,r)=>n(t,r)),sparse:e.sparse.map((t,r)=>n(t,r))}}function X(e,n){const t=Array.from({length:e},(s,u)=>u);if(e===0)return g.map(()=>[]);if(n==="exact")return g.map(()=>t);if(n==="sparse"){const s=Math.ceil(e/g.length);return g.map((u,m)=>{const c=m*s;return t.slice(c,c+s)})}const r=Math.min(5,e);if(e<=r)return g.map(()=>t);const o=Math.floor((e-r)/2),i=Math.max(0,e-r);return[t.slice(0,r),t.slice(o,o+r),t.slice(i,i+r)]}const _={exact:[1,1,1,1,1],overlap:[1,3,5,7,9],sparse:[1,7,13,19,25]},Y={exact:[8,8,8,8,8],overlap:[8,10,12,14,16],sparse:[6,9,12,15,18]},V=y(w,e=>e+.5),W=y(b,e=>`https://example.org/${Q(e)}`),Z=A(_,e=>Array.from({length:5},(n,t)=>`2024-03-${C(e+t)}`)),J=A(_,e=>Array.from({length:5},(n,t)=>{const r=C(e+t),o=C(8+t);return`2024-03-${r}T${o}:00:00Z`})),K=A(Y,e=>Array.from({length:5},(n,t)=>`${C(e+t)}:00:00`)),R=["http://example.org/taste","http://example.org/color","http://example.org/size","http://example.org/shape","http://example.org/texture"],ee=y(b,(e,n)=>({system:R[n%R.length],code:Q(e),display:e})),M=["Patient","Practitioner","Organization","Location","Device"],te=y(b,(e,n,t)=>({reference:`${M[n%M.length]}/${n+1}${t+1}`,display:e})),ne=y(b,e=>({contentType:"text/plain",url:`https://files.example/${Q(e)}.txt`,title:e})),P=["mg","ml","cm","kg","bpm"],re=y(w,(e,n)=>{const t=P[n%P.length];return{value:e,unit:t,system:"http://unitsofmeasure.org",code:t}});function oe(e,n){return e==="integer"?w[n]:e==="decimal"?V[n]:e==="boolean"?H[n]:e==="date"?Z[n]:e==="dateTime"?J[n]:e==="time"?K[n]:e==="url"?W[n]:e==="coding"?ee[n]:e==="reference"?te[n]:e==="attachment"?ne[n]:e==="quantity"?re[n]:b[n]}function ie(e){if(e.initialSelection==="none"||e.values.length===0)return[];if(!(e.initialSelection==="full"||e.initialSelection==="partial"&&e.index%2===0))return[];if(!e.repeats)return[e.values[0]];const t=e.initialSelection==="partial"?1:e.maxSelections??e.values.length;return e.values.slice(0,Math.min(t,e.values.length))}function ae(e){const n=oe(e.answerType,e.optionOverlap);return N.slice(0,e.questionCount).map((r,o)=>{const i=e.selectionMode==="multi"||e.selectionMode==="mixed"&&o%2===0,s=(n[o]??[]).slice(0,e.optionCount),u=ie({values:s,repeats:i,maxSelections:e.maxSelections,initialSelection:e.initialSelection,index:o}),m=[];return i&&e.maxSelections!==void 0&&m.push({url:G.MAX_OCCURS,valueInteger:e.maxSelections}),l({linkId:r.linkId,text:r.text,type:e.answerType,repeats:i,answerConstraint:"optionsOnly",answerOption:F(e.answerType,s),extensions:m,initial:E(e.answerType,u)})})}const fe={title:"Renderers/Group",parameters:{layout:"padded",docs:{description:{component:"Group renderer examples for each supported control."}}}};function L(e){return{render:(n,t)=>d.jsx(p,{questionnaire:q(e),storyId:t.id,mode:"node"})}}const se={orientation:{name:"Orientation",options:["vertical","horizontal"],control:{type:"select"}},optionOverlap:{name:"Option overlap",options:["exact","overlap","sparse"],control:{type:"select"}},answerType:{name:"Answer type",options:D,control:{type:"select"}},questionCount:{name:"Question count",options:[0,1,3,5],control:{type:"select"}},optionCount:{name:"Option count",options:[0,1,3,5],control:{type:"select"}},selectionMode:{name:"Selection mode",options:["single","multi","mixed"],control:{type:"select"}},maxSelections:{name:"Max selections",options:["none","1","2"],control:{type:"select"}},initialSelection:{name:"Initial selection",options:["none","partial","full"],control:{type:"select"}},readOnly:{name:"Read-only",control:{type:"boolean"}}},le={questionTypes:{name:"Question types",options:D,control:{type:"multi-select"}},questionOverlap:{name:"Question overlap",options:["exact","overlap","sparse"],control:{type:"select"}},readOnly:{name:"Read-only",control:{type:"boolean"}}},ce={tabCount:{name:"Tab count",control:{type:"range",min:2,max:12,step:1}},labelStyle:{name:"Label length",options:["short","long","mixed"],control:{type:"select"}}};function ue(e,n){const t=["Overview","Profile","Security","Billing","Team","Activity","Alerts","Support","Preferences","Integrations","Audit","Usage"],r=["Overview and quick metrics","Profile and account details","Security and access controls","Billing and invoice settings","Team members and permissions","Activity history and logs","Alerts and notification rules","Support and service contacts","Preferences and appearance","Integrations and webhooks","Audit trail and compliance","Usage and plan limits"],o=t[e%t.length],i=r[e%r.length];return n==="short"?o:n==="long"?i:e%2===0?o:i}function de(e,n){const t=Math.max(1,Math.floor(e));return Array.from({length:t},(r,o)=>{const i=o+1;return a({linkId:`tab-${i}`,text:ue(o,n),item:[l({linkId:`tab-${i}-field`,text:`Field ${i}`,type:"string",control:"text-box"})]})})}const h={name:"Default",...L(a({linkId:"group-default",text:"Default",item:j}))},f={name:"Table",args:{orientation:"vertical",optionOverlap:"overlap",answerType:"string",questionCount:3,optionCount:3,selectionMode:"single",maxSelections:"none",initialSelection:"none",readOnly:!1},argTypes:se,render:(e,n)=>{const t=e.orientation==="horizontal"?"htable":"table",r=e.maxSelections==="none"?void 0:Number(e.maxSelections),o=ae({answerType:e.answerType,questionCount:e.questionCount,optionCount:e.optionCount,optionOverlap:e.optionOverlap,selectionMode:e.selectionMode,maxSelections:r,initialSelection:e.initialSelection}),i=a({linkId:"group-table",text:"Selection table",control:t,readOnly:e.readOnly,item:o});return d.jsx(p,{questionnaire:q(i),storyId:n.id,mode:"node"})}},I={name:"Grid",args:{questionTypes:["string","boolean","time","attachment"],questionOverlap:"overlap",readOnly:!1},argTypes:le,render:(e,n)=>{const t=U.filter(s=>e.questionTypes.includes(s.type)),r=X(t.length,e.questionOverlap),o=g.map((s,u)=>{const m=r[u]??[];return a({linkId:`row-${u+1}`,text:s,item:m.map(c=>t[c]).filter(Boolean).map(c=>l({linkId:c.linkId,text:c.text,type:c.type}))})}),i=a({linkId:"group-grid",text:"Daily check-in",control:"grid",readOnly:e.readOnly,item:o});return d.jsx(p,{questionnaire:q(i),storyId:n.id,mode:"node"})}},S={name:"Grid Table",...L(a({linkId:"group-gtable",text:"Medications",control:"gtable",repeats:!0,extensions:[{url:G.MIN_OCCURS,valueInteger:1}],item:[l({linkId:"med-name",text:"Medication",type:"string",control:"text-box"}),l({linkId:"dose",text:"Dose",type:"integer",control:"spinner"}),l({linkId:"frequency",text:"Frequency",type:"string",control:"text-box"})]}))},k={name:"Header",render:(e,n)=>d.jsx(p,{questionnaire:{resourceType:"Questionnaire",status:"active",item:[a({linkId:"group-header",control:"header",item:B}),a({linkId:"header-page-demographics",text:"Demographics",control:"page",item:x("header-page-demographics","Demographics")}),a({linkId:"header-page-medications",text:"Current medications",control:"page",item:x("header-page-medications","Current medications")})]},storyId:n.id,mode:"form"})},T={name:"Footer",render:(e,n)=>d.jsx(p,{questionnaire:{resourceType:"Questionnaire",status:"active",item:[a({linkId:"footer-page-intake",text:"Intake details",control:"page",item:x("footer-page-intake","Intake details")}),a({linkId:"footer-page-history",text:"Medical history",control:"page",item:x("footer-page-history","Medical history")}),a({linkId:"group-footer",control:"footer",item:z})]},storyId:n.id,mode:"form"})},O={name:"Page",render:(e,n)=>d.jsx(p,{questionnaire:{resourceType:"Questionnaire",status:"active",item:[a({linkId:"group-page-demographics",text:"Demographics",control:"page",item:x("page-story-demographics","Demographics")}),a({linkId:"group-page-care-plan",text:"Care plan",control:"page",item:x("page-story-care-plan","Care plan")})]},storyId:n.id,mode:"form"})},v={name:"Tabs",args:{tabCount:3,labelStyle:"mixed"},argTypes:ce,render:(e,n)=>{const t=a({linkId:"group-tabs",text:"Profile",control:"tab-container",item:de(e.tabCount,e.labelStyle)});return d.jsx(p,{questionnaire:q(t),storyId:n.id,mode:"node"})}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: "Default",
  ...makeStory(buildGroupItem({
    linkId: "group-default",
    text: "Default",
    item: baseQuestions
  }))
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Table",
  args: {
    orientation: "vertical",
    optionOverlap: "overlap",
    answerType: "string",
    questionCount: 3,
    optionCount: 3,
    selectionMode: "single",
    maxSelections: "none",
    initialSelection: "none",
    readOnly: false
  },
  argTypes: tableGroupArgumentTypes,
  render: (arguments_: TableGroupArguments, context) => {
    const control = arguments_.orientation === "horizontal" ? "htable" : "table";
    const maxSelections = arguments_.maxSelections === "none" ? undefined : Number(arguments_.maxSelections);
    const tableQuestions = buildTableQuestions({
      answerType: arguments_.answerType,
      questionCount: arguments_.questionCount,
      optionCount: arguments_.optionCount,
      optionOverlap: arguments_.optionOverlap,
      selectionMode: arguments_.selectionMode,
      maxSelections,
      initialSelection: arguments_.initialSelection
    });
    const item = buildGroupItem({
      linkId: "group-table",
      text: "Selection table",
      control,
      readOnly: arguments_.readOnly,
      item: tableQuestions
    });
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} mode="node" />;
  }
} satisfies StoryObj<TableGroupArguments>`,...f.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: "Grid",
  args: {
    questionTypes: ["string", "boolean", "time", "attachment"],
    questionOverlap: "overlap",
    readOnly: false
  },
  argTypes: gridGroupArgumentTypes,
  render: (arguments_: GridGroupArguments, context) => {
    const questionPool = gridQuestionSpecs.filter(question => arguments_.questionTypes.includes(question.type));
    const questionIndexes = buildGridQuestionOverlapSets(questionPool.length, arguments_.questionOverlap);
    const rows = gridRowLabels.map((rowLabel, rowIndex) => {
      const rowQuestionIndexes = questionIndexes[rowIndex] ?? [];
      return buildGroupItem({
        linkId: \`row-\${rowIndex + 1}\`,
        text: rowLabel,
        item: rowQuestionIndexes.map(questionIndex => questionPool[questionIndex]).filter(Boolean).map(question => buildQuestionItem({
          linkId: question.linkId,
          text: question.text,
          type: question.type
        }))
      });
    });
    const item = buildGroupItem({
      linkId: "group-grid",
      text: "Daily check-in",
      control: "grid",
      readOnly: arguments_.readOnly,
      item: rows
    });
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} mode="node" />;
  }
} satisfies StoryObj<GridGroupArguments>`,...I.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "Grid Table",
  ...makeStory(buildGroupItem({
    linkId: "group-gtable",
    text: "Medications",
    control: "gtable",
    repeats: true,
    extensions: [{
      url: EXT.MIN_OCCURS,
      valueInteger: 1
    }],
    item: [buildQuestionItem({
      linkId: "med-name",
      text: "Medication",
      type: "string",
      control: "text-box"
    }), buildQuestionItem({
      linkId: "dose",
      text: "Dose",
      type: "integer",
      control: "spinner"
    }), buildQuestionItem({
      linkId: "frequency",
      text: "Frequency",
      type: "string",
      control: "text-box"
    })]
  }))
}`,...S.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  name: "Header",
  render: (_arguments, context) => <Renderer questionnaire={{
    resourceType: "Questionnaire",
    status: "active",
    item: [buildGroupItem({
      linkId: "group-header",
      control: "header",
      item: headerStoryItems
    }), buildGroupItem({
      linkId: "header-page-demographics",
      text: "Demographics",
      control: "page",
      item: buildPageQuestions("header-page-demographics", "Demographics")
    }), buildGroupItem({
      linkId: "header-page-medications",
      text: "Current medications",
      control: "page",
      item: buildPageQuestions("header-page-medications", "Current medications")
    })]
  }} storyId={context.id} mode="form" />
}`,...k.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: "Footer",
  render: (_arguments, context) => <Renderer questionnaire={{
    resourceType: "Questionnaire",
    status: "active",
    item: [buildGroupItem({
      linkId: "footer-page-intake",
      text: "Intake details",
      control: "page",
      item: buildPageQuestions("footer-page-intake", "Intake details")
    }), buildGroupItem({
      linkId: "footer-page-history",
      text: "Medical history",
      control: "page",
      item: buildPageQuestions("footer-page-history", "Medical history")
    }), buildGroupItem({
      linkId: "group-footer",
      control: "footer",
      item: footerStoryItems
    })]
  }} storyId={context.id} mode="form" />
}`,...T.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: "Page",
  render: (_arguments, context) => <Renderer questionnaire={{
    resourceType: "Questionnaire",
    status: "active",
    item: [buildGroupItem({
      linkId: "group-page-demographics",
      text: "Demographics",
      control: "page",
      item: buildPageQuestions("page-story-demographics", "Demographics")
    }), buildGroupItem({
      linkId: "group-page-care-plan",
      text: "Care plan",
      control: "page",
      item: buildPageQuestions("page-story-care-plan", "Care plan")
    })]
  }} storyId={context.id} mode="form" />
}`,...O.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: "Tabs",
  args: {
    tabCount: 3,
    labelStyle: "mixed"
  },
  argTypes: tabContainerArgumentTypes,
  render: (arguments_: TabContainerGroupArguments, context) => {
    const item = buildGroupItem({
      linkId: "group-tabs",
      text: "Profile",
      control: "tab-container",
      item: buildTabItems(arguments_.tabCount, arguments_.labelStyle)
    });
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} mode="node" />;
  }
} satisfies StoryObj<TabContainerGroupArguments>`,...v.parameters?.docs?.source}}};const Ie=["DefaultGroupRenderer","TableGroupRenderer","GridGroupRenderer","GridTableGroupRenderer","HeaderGroupRenderer","FooterGroupRenderer","PageGroupRenderer","TabContainerGroupRenderer"];export{h as DefaultGroupRenderer,T as FooterGroupRenderer,I as GridGroupRenderer,S as GridTableGroupRenderer,k as HeaderGroupRenderer,O as PageGroupRenderer,v as TabContainerGroupRenderer,f as TableGroupRenderer,Ie as __namedExportsOrder,fe as default};
