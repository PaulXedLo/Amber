// plugins/vee-validate.ts
import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage,
  defineRule,
  configure,
} from "vee-validate";
import {
  required,
  email,
  min,
  digits,
  max,
  confirmed,
  min_value,
  max_value,
  alpha,
  not_one_of as excluded,
  alpha_spaces as alphaSpaces,
} from "@vee-validate/rules";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("VeeForm", VeeForm);
  nuxtApp.vueApp.component("VeeField", VeeField);
  nuxtApp.vueApp.component("ErrorMessage", ErrorMessage);

  defineRule("required", required);
  defineRule("email", email);
  defineRule("alpha", alpha);
  defineRule("min", min);
  defineRule("digits", digits);
  defineRule("max", max);
  defineRule("confirmed", confirmed);
  defineRule("minAge", min_value);
  defineRule("maxValue", max_value);
  defineRule("excluded", excluded);
  defineRule("passwords_mismatch", confirmed);
  defineRule("alphaSpaces", alphaSpaces);

  configure({
    generateMessage: (ctx) => {
      const messages = {
        required: `The ${ctx.field} field is required.`,
        alphaSpaces: `Numbers in name are not allowed`,
        digits: `The age is not valid`,
        email: `The ${ctx.field} must be a valid email.`,
        min: `The ${ctx.field} is too short.`,
        max: `The ${ctx.field} is too long.`,
        passwords_mismatch: `The passwords do not match`,
        minAge: `You must be at least 16 years old.`,
        alpha: `No spaces allowed in username`,
      };
      return messages[ctx.rule?.name] || `The ${ctx.field} is invalid.`;
    },
    validateOnBlur: false,
    validateOnChange: true,
    validateOnInput: false,
    validateOnModelUpdate: true,
  });
});
