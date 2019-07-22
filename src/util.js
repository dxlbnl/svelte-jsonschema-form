
const widgetMap = {
  boolean: {
    checkbox: "CheckboxWidget",
    radio: "RadioWidget",
    select: "SelectWidget",
    hidden: "HiddenWidget",
  },
  string: {
    text: "TextWidget",
    password: "PasswordWidget",
    email: "EmailWidget",
    hostname: "TextWidget",
    ipv4: "TextWidget",
    ipv6: "TextWidget",
    uri: "URLWidget",
    "data-url": "FileWidget",
    radio: "RadioWidget",
    select: "SelectWidget",
    textarea: "TextareaWidget",
    hidden: "HiddenWidget",
    date: "DateWidget",
    datetime: "DateTimeWidget",
    "date-time": "DateTimeWidget",
    "alt-date": "AltDateWidget",
    "alt-datetime": "AltDateTimeWidget",
    color: "ColorWidget",
    file: "FileWidget",
  },
  number: {
    text: "TextWidget",
    select: "SelectWidget",
    updown: "UpDownWidget",
    range: "RangeWidget",
    radio: "RadioWidget",
    hidden: "HiddenWidget",
  },
  integer: {
    text: "TextWidget",
    select: "SelectWidget",
    updown: "UpDownWidget",
    range: "RangeWidget",
    radio: "RadioWidget",
    hidden: "HiddenWidget",
  },
  array: {
    select: "SelectWidget",
    checkboxes: "CheckboxesWidget",
    files: "FileWidget",
  },
};


export function toConstant(schema) {
  if (Array.isArray(schema.enum) && schema.enum.length === 1) {
    return schema.enum[0];
  } else if (schema.hasOwnProperty("const")) {
    return schema.const;
  } else {
    throw new Error("schema cannot be inferred as a constant");
  }
}

export function optionsList(schema) {
  if (schema.enum) {
    return schema.enum.map((value, i) => {
      const label = (schema.enumNames && schema.enumNames[i]) || String(value);
      return { label, value };
    });
  } else {
    const altSchemas = schema.oneOf || schema.anyOf;
    return altSchemas.map((schema, i) => {
      const value = toConstant(schema);
      const label = schema.title || String(value);
      return { label, value };
    });
  }
}

export function getWidget(schema, widget, registeredWidgets = {}) {
  const { type } = schema;
  console.log("Getting widget:", type, widget)

  // function mergeOptions(Widget) {
  //   // cache return value as property of widget for proper react reconciliation
  //   if (!Widget.MergedWidget) {
  //     const defaultOptions =
  //       (Widget.defaultProps && Widget.defaultProps.options) || {};
  //     Widget.MergedWidget = ({ options = {}, ...props }) => (
  //       <Widget options={{ ...defaultOptions, ...options }} {...props} />
  //     );
  //   }
  //   return Widget.MergedWidget;
  // }

  if (typeof widget === "function" || (widget instanceof Object && widget.hasOwnProperty('render'))) {
    return widget;
  }

  if (typeof widget !== "string") {
    console.log("Error vGetting widget:", type, widget)

    throw new Error(`Unsupported widget definition: ${typeof widget}`);
  }

  if (registeredWidgets.hasOwnProperty(widget)) {
    const registeredWidget = registeredWidgets[widget];
    return getWidget(schema, registeredWidget, registeredWidgets);
  }

  if (!widgetMap.hasOwnProperty(type)) {
    throw new Error(`No widget for type "${type}"`);
  }

  if (widgetMap[type].hasOwnProperty(widget)) {
    const widgetName = widgetMap[type][widget]
    const registeredWidget = registeredWidgets[widgetName];
    console.log("Getting widget", widgetName, registeredWidget)
    return getWidget(schema, registeredWidget, registeredWidgets);
  }

  throw new Error(`No widget "${widget}" for type "${type}"`);
}

function findSchemaDefinition($ref, definitions = {}) {
  // Extract and use the referenced definition if we have it.
  const match = /^#\/definitions\/(.*)$/.exec($ref);
  if (match && match[1]) {
    const parts = match[1].split("/");
    let current = definitions;
    for (let part of parts) {
      part = part.replace(/~1/g, "/").replace(/~0/g, "~");
      if (current.hasOwnProperty(part)) {
        current = current[part];
      } else {
        // No matching definition found, that's an error (bogus schema?)
        throw new Error(`Could not find a definition for ${$ref}.`);
      }
    }
    return current;
  }

  // No matching definition found, that's an error (bogus schema?)
  throw new Error(`Could not find a definition for ${$ref}.`);
}

export function retrieveSchema(schema, definitions = {}) {
  // No $ref attribute found, returning the original schema.
  if (!schema.hasOwnProperty("$ref")) {
    return schema;
  }
  // Retrieve the referenced schema definition.
  const $refSchema = findSchemaDefinition(schema.$ref, definitions);
  // Drop the $ref property of the source schema.
  const { $ref, ...localSchema } = schema;
  // Update referenced schema definition with local schema properties.
  return { ...$refSchema, ...localSchema };
}

export function getUiOptions(uiSchema) {
  // get all passed options from ui:widget, ui:options, and ui:<optionName>
  return Object.keys(uiSchema)
    .filter(key => key.indexOf("ui:") === 0)
    .reduce((options, key) => {
      const value = uiSchema[key];

      if (key === "ui:widget" && isObject(value)) {
        console.warn(
          "Setting options via ui:widget object is deprecated, use ui:options instead"
        );
        return {
          ...options,
          ...(value.options || {}),
          widget: value.component,
        };
      }
      if (key === "ui:options" && isObject(value)) {
        return { ...options, ...value };
      }
      return { ...options, [key.substring(3)]: value };
    }, {});
}

export function isObject(thing) {
  return typeof thing === "object" && thing !== null && !Array.isArray(thing);
}

export function toIdSchema(schema, id, definitions) {
  const idSchema = {
    $id: id || "root",
  };
  if ("$ref" in schema) {
    const _schema = retrieveSchema(schema, definitions);
    return toIdSchema(_schema, id, definitions);
  }
  if ("items" in schema && !schema.items.$ref) {
    return toIdSchema(schema.items, id, definitions);
  }
  if (schema.type !== "object") {
    return idSchema;
  }
  for (const name in schema.properties || {}) {
    const field = schema.properties[name];
    const fieldId = idSchema.$id + "_" + name;
    idSchema[name] = toIdSchema(field, fieldId, definitions);
  }
  return idSchema;
}