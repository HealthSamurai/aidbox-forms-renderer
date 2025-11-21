import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"quantity-wc-lookup-repeating-options-or-string",text:"Enter a quantity",type:"quantity",repeats:!0,control:"lookup",answerConstraint:"optionsOrString",answerOption:p("quantity",[{value:70,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"},{value:80,unit:"kg",system:"http://unitsofmeasure.org",code:"kg"}])}),e=JSON.stringify(r.form.questionnaire,null,2),q={title:"Question/quantity/with item-control/lookup/repeating/with answer-options",component:o,parameters:a,argTypes:i},t={name:"options or string",args:{questionnaireSource:e},render:n=>s.jsx(o,{scenario:{name:"quantity-wc-lookup-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-lookup-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const f=["OptionsOrString"];export{t as OptionsOrString,f as __namedExportsOrder,q as default};
