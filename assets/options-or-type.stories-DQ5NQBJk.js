import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"quantity-woc-repeating-options-or-type",text:"Enter a quantity",type:"quantity",repeats:!0,answerConstraint:"optionsOrType",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),t=JSON.stringify(r.form.questionnaire,null,2),q={title:"Question/quantity/without item-control/repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:t},render:n=>a.jsx(o,{scenario:{name:"quantity-woc-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-woc-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOrType"];export{e as OptionsOrType,S as __namedExportsOrder,q as default};
