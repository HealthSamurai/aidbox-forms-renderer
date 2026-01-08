import{j as q}from"./iframe-DSAEXqi9.js";import{R as w,a as L,b as r,I as A,E as h,f as D,m as F}from"./helpers-Bf5p6RRb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D9jtiV6-.js";import"./index-BI2MhMiX.js";function a(e){const t=[...e.extensions??[]];return e.control&&t.push({url:h.ITEM_CONTROL,valueCodeableConcept:{coding:[{system:A,code:e.control}]}}),{linkId:e.linkId,text:e.text,type:"group",repeats:e.repeats,readOnly:e.readOnly,extension:t.length>0?t:void 0,item:e.item&&e.item.length>0?e.item:void 0}}const c=[r({linkId:"first-name",text:"First name",type:"string",control:"text-box"}),r({linkId:"age",text:"Age",type:"integer",control:"spinner"})],_=[{linkId:"taste",text:"Taste"},{linkId:"color",text:"Color"},{linkId:"size",text:"Size"},{linkId:"shape",text:"Shape"},{linkId:"texture",text:"Texture"}],p={exact:[["Alpha","Bravo","Charlie","Delta","Echo"],["Alpha","Bravo","Charlie","Delta","Echo"],["Alpha","Bravo","Charlie","Delta","Echo"],["Alpha","Bravo","Charlie","Delta","Echo"],["Alpha","Bravo","Charlie","Delta","Echo"]],overlap:[["Red","Blue","Green","Yellow","Purple"],["Blue","Green","Yellow","Purple","Orange"],["Green","Yellow","Purple","Orange","Teal"],["Yellow","Purple","Orange","Teal","Cyan"],["Purple","Orange","Teal","Cyan","Magenta"]],sparse:[["Sweet","Salty","Sour","Bitter","Umami"],["Circle","Square","Triangle","Hexagon","Star"],["Small","Medium","Large","XL","XXL"],["Hot","Cold","Warm","Cool","Icy"],["North","South","East","West","Center"]]},O={exact:[[10,20,30,40,50],[10,20,30,40,50],[10,20,30,40,50],[10,20,30,40,50],[10,20,30,40,50]],overlap:[[1,2,3,4,5],[3,4,5,6,7],[5,6,7,8,9],[7,8,9,10,11],[9,10,11,12,13]],sparse:[[10,11,12,13,14],[20,21,22,23,24],[30,31,32,33,34],[40,41,42,43,44],[50,51,52,53,54]]},N={exact:[[!0,!1],[!0,!1],[!0,!1],[!0,!1],[!0,!1]],overlap:[[!0,!1],[!0,!1],[!0,!1],[!0,!1],[!0,!1]],sparse:[[!0,!1],[!0,!1],[!0,!1],[!0,!1],[!0,!1]]};function G(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function k(e){return String(e).padStart(2,"0")}function u(e,t){return{exact:e.exact.map((n,o)=>n.map((i,l)=>t(i,o,l))),overlap:e.overlap.map((n,o)=>n.map((i,l)=>t(i,o,l))),sparse:e.sparse.map((n,o)=>n.map((i,l)=>t(i,o,l)))}}function T(e,t){return{exact:e.exact.map((n,o)=>t(n,o)),overlap:e.overlap.map((n,o)=>t(n,o)),sparse:e.sparse.map((n,o)=>t(n,o))}}const E={exact:[1,1,1,1,1],overlap:[1,3,5,7,9],sparse:[1,7,13,19,25]},$={exact:[8,8,8,8,8],overlap:[8,10,12,14,16],sparse:[6,9,12,15,18]},z=u(O,e=>e+.5),B=u(p,e=>`https://example.org/${G(e)}`),H=T(E,e=>Array.from({length:5},(t,n)=>`2024-03-${k(e+n)}`)),X=T(E,e=>Array.from({length:5},(t,n)=>{const o=k(e+n),i=k(8+n);return`2024-03-${o}T${i}:00:00Z`})),j=T($,e=>Array.from({length:5},(t,n)=>`${k(e+n)}:00:00`)),R=["http://example.org/taste","http://example.org/color","http://example.org/size","http://example.org/shape","http://example.org/texture"],U=u(p,(e,t)=>({system:R[t%R.length],code:G(e),display:e})),Q=["Patient","Practitioner","Organization","Location","Device"],Y=u(p,(e,t,n)=>({reference:`${Q[t%Q.length]}/${t+1}${n+1}`,display:e})),V=u(p,e=>({contentType:"text/plain",url:`https://files.example/${G(e)}.txt`,title:e})),M=["mg","ml","cm","kg","bpm"],W=u(O,(e,t)=>{const n=M[t%M.length];return{value:e,unit:n,system:"http://unitsofmeasure.org",code:n}});function Z(e,t){return e==="integer"?O[t]:e==="decimal"?z[t]:e==="boolean"?N[t]:e==="date"?H[t]:e==="dateTime"?X[t]:e==="time"?j[t]:e==="url"?B[t]:e==="coding"?U[t]:e==="reference"?Y[t]:e==="attachment"?V[t]:e==="quantity"?W[t]:p[t]}function J(e){if(e.initialSelection==="none"||e.values.length===0)return[];if(!(e.initialSelection==="full"||e.initialSelection==="partial"&&e.index%2===0))return[];if(!e.repeats)return[e.values[0]];const n=e.initialSelection==="partial"?1:e.maxSelections??e.values.length;return e.values.slice(0,Math.min(n,e.values.length))}function K(e){const t=Z(e.answerType,e.optionOverlap);return _.slice(0,e.questionCount).map((o,i)=>{const l=e.selectionMode==="multi"||e.selectionMode==="mixed"&&i%2===0,C=(t[i]??[]).slice(0,e.optionCount),P=J({values:C,repeats:l,maxSelections:e.maxSelections,initialSelection:e.initialSelection,index:i}),v=[];return l&&e.maxSelections!==void 0&&v.push({url:h.MAX_OCCURS,valueInteger:e.maxSelections}),r({linkId:o.linkId,text:o.text,type:e.answerType,repeats:l,answerConstraint:"optionsOnly",answerOption:F(e.answerType,C),extensions:v,initial:D(e.answerType,P)})})}const ae={title:"Renderers/Group",parameters:{layout:"padded",docs:{description:{component:"Group renderer examples for each supported control."}}}};function s(e){return{render:(t,n)=>q.jsx(w,{questionnaire:L(e),storyId:n.id})}}const ee={orientation:{name:"Orientation",options:["vertical","horizontal"],control:{type:"select"}},optionOverlap:{name:"Option overlap",options:["exact","overlap","sparse"],control:{type:"select"}},answerType:{name:"Answer type",options:["string","text","integer","decimal","boolean","date","dateTime","time","url","coding","reference","attachment","quantity"],control:{type:"select"}},questionCount:{name:"Question count",options:[0,1,3,5],control:{type:"select"}},optionCount:{name:"Option count",options:[0,1,3,5],control:{type:"select"}},selectionMode:{name:"Selection mode",options:["single","multi","mixed"],control:{type:"select"}},maxSelections:{name:"Max selections",options:["none","1","2"],control:{type:"select"}},initialSelection:{name:"Initial selection",options:["none","partial","full"],control:{type:"select"}},readOnly:{name:"Read-only",control:{type:"boolean"}}},d={name:"Default group",...s(a({linkId:"group-default",text:"Default group",item:c}))},m={name:"List group",...s(a({linkId:"group-list",text:"List group",control:"list",item:c}))},g={name:"Table group",args:{orientation:"vertical",optionOverlap:"overlap",answerType:"string",questionCount:3,optionCount:3,selectionMode:"single",maxSelections:"none",initialSelection:"none",readOnly:!1},argTypes:ee,render:(e,t)=>{const n=e.orientation==="horizontal"?"htable":"table",o=e.maxSelections==="none"?void 0:Number(e.maxSelections),i=K({answerType:e.answerType,questionCount:e.questionCount,optionCount:e.optionCount,optionOverlap:e.optionOverlap,selectionMode:e.selectionMode,maxSelections:o,initialSelection:e.initialSelection}),l=a({linkId:"group-table",text:"Selection table",control:n,readOnly:e.readOnly,item:i});return q.jsx(w,{questionnaire:L(l),storyId:t.id})}},x={name:"Grid group",...s(a({linkId:"group-grid",text:"Daily check-in",control:"grid",item:[a({linkId:"row-intake",text:"Morning",item:[r({linkId:"intake-fluid",text:"Fluid intake (mL)",type:"integer",control:"spinner"}),r({linkId:"intake-notes",text:"Notes",type:"string",control:"text-box"})]}),a({linkId:"row-output",text:"Evening",item:[r({linkId:"output-fluid",text:"Fluid output (mL)",type:"integer",control:"spinner"}),r({linkId:"output-notes",text:"Notes",type:"string",control:"text-box"})]})]}))},b={name:"Grid table group",...s(a({linkId:"group-gtable",text:"Medications",control:"gtable",repeats:!0,extensions:[{url:h.MIN_OCCURS,valueInteger:1}],item:[r({linkId:"med-name",text:"Medication",type:"string",control:"text-box"}),r({linkId:"dose",text:"Dose",type:"integer",control:"spinner"}),r({linkId:"frequency",text:"Frequency",type:"string",control:"text-box"})]}))},I={name:"Header group",...s(a({linkId:"group-header",text:"Header section",control:"header",item:c}))},y={name:"Footer group",...s(a({linkId:"group-footer",text:"Footer section",control:"footer",item:c}))},S={name:"Page group",...s(a({linkId:"group-page",text:"Page section",control:"page",item:c}))},f={name:"Tab container group",...s(a({linkId:"group-tabs",text:"Profile",control:"tab-container",item:[a({linkId:"tab-basics",text:"Basics",item:[r({linkId:"first-name-tab",text:"First name",type:"string",control:"text-box"}),r({linkId:"last-name-tab",text:"Last name",type:"string",control:"text-box"})]}),a({linkId:"tab-contact",text:"Contact",item:[r({linkId:"email-tab",text:"Email",type:"string",control:"text-box"}),r({linkId:"phone-tab",text:"Phone",type:"string",control:"text-box"})]})]}))};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: "Default group",
  ...makeStory(buildGroupItem({
    linkId: "group-default",
    text: "Default group",
    item: baseQuestions
  }))
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: "List group",
  ...makeStory(buildGroupItem({
    linkId: "group-list",
    text: "List group",
    control: "list",
    item: baseQuestions
  }))
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: "Table group",
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
  argTypes: tableGroupArgTypes,
  render: (args: TableGroupArgs, context) => {
    const control = args.orientation === "horizontal" ? "htable" : "table";
    const maxSelections = args.maxSelections === "none" ? undefined : Number(args.maxSelections);
    const tableQuestions = buildTableQuestions({
      answerType: args.answerType,
      questionCount: args.questionCount,
      optionCount: args.optionCount,
      optionOverlap: args.optionOverlap,
      selectionMode: args.selectionMode,
      maxSelections,
      initialSelection: args.initialSelection
    });
    const item = buildGroupItem({
      linkId: "group-table",
      text: "Selection table",
      control,
      readOnly: args.readOnly,
      item: tableQuestions
    });
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />;
  }
} satisfies StoryObj<TableGroupArgs>`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Grid group",
  ...makeStory(buildGroupItem({
    linkId: "group-grid",
    text: "Daily check-in",
    control: "grid",
    item: [buildGroupItem({
      linkId: "row-intake",
      text: "Morning",
      item: [buildQuestionItem({
        linkId: "intake-fluid",
        text: "Fluid intake (mL)",
        type: "integer",
        control: "spinner"
      }), buildQuestionItem({
        linkId: "intake-notes",
        text: "Notes",
        type: "string",
        control: "text-box"
      })]
    }), buildGroupItem({
      linkId: "row-output",
      text: "Evening",
      item: [buildQuestionItem({
        linkId: "output-fluid",
        text: "Fluid output (mL)",
        type: "integer",
        control: "spinner"
      }), buildQuestionItem({
        linkId: "output-notes",
        text: "Notes",
        type: "string",
        control: "text-box"
      })]
    })]
  }))
}`,...x.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "Grid table group",
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
}`,...b.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  name: "Header group",
  ...makeStory(buildGroupItem({
    linkId: "group-header",
    text: "Header section",
    control: "header",
    item: baseQuestions
  }))
}`,...I.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "Footer group",
  ...makeStory(buildGroupItem({
    linkId: "group-footer",
    text: "Footer section",
    control: "footer",
    item: baseQuestions
  }))
}`,...y.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: "Page group",
  ...makeStory(buildGroupItem({
    linkId: "group-page",
    text: "Page section",
    control: "page",
    item: baseQuestions
  }))
}`,...S.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: "Tab container group",
  ...makeStory(buildGroupItem({
    linkId: "group-tabs",
    text: "Profile",
    control: "tab-container",
    item: [buildGroupItem({
      linkId: "tab-basics",
      text: "Basics",
      item: [buildQuestionItem({
        linkId: "first-name-tab",
        text: "First name",
        type: "string",
        control: "text-box"
      }), buildQuestionItem({
        linkId: "last-name-tab",
        text: "Last name",
        type: "string",
        control: "text-box"
      })]
    }), buildGroupItem({
      linkId: "tab-contact",
      text: "Contact",
      item: [buildQuestionItem({
        linkId: "email-tab",
        text: "Email",
        type: "string",
        control: "text-box"
      }), buildQuestionItem({
        linkId: "phone-tab",
        text: "Phone",
        type: "string",
        control: "text-box"
      })]
    })]
  }))
}`,...f.parameters?.docs?.source}}};const le=["DefaultGroupRenderer","ListGroupRenderer","TableGroupRenderer","GridGroupRenderer","GridTableGroupRenderer","HeaderGroupRenderer","FooterGroupRenderer","PageGroupRenderer","TabContainerGroupRenderer"];export{d as DefaultGroupRenderer,y as FooterGroupRenderer,x as GridGroupRenderer,b as GridTableGroupRenderer,I as HeaderGroupRenderer,m as ListGroupRenderer,S as PageGroupRenderer,f as TabContainerGroupRenderer,g as TableGroupRenderer,le as __namedExportsOrder,ae as default};
