
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
    console.log("Error getting widget:", type, widget)

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

function computeDefaults(schema, parentDefaults, definitions = {}) {
  // Compute the defaults recursively: give highest priority to deepest nodes.
  let defaults = parentDefaults;
  if (isObject(defaults) && isObject(schema.default)) {
    // For object defaults, only override parent defaults that are defined in
    // schema.default.
    defaults = mergeObjects(defaults, schema.default);
  } else if ("default" in schema) {
    // Use schema defaults for this node.
    defaults = schema.default;
  } else if ("$ref" in schema) {
    // Use referenced schema defaults for this node.
    const refSchema = findSchemaDefinition(schema.$ref, definitions);
    return computeDefaults(refSchema, defaults, definitions);
  } else if (isFixedItems(schema)) {
    defaults = schema.items.map(itemSchema =>
      computeDefaults(itemSchema, undefined, definitions)
    );
  }
  // Not defaults defined for this node, fallback to generic typed ones.
  if (typeof defaults === "undefined") {
    defaults = schema.default;
  }

  switch (schema.type) {
    // We need to recur for object schema inner default values.
    case "object":
      return Object.keys(schema.properties || {}).reduce((acc, key) => {
        // Compute the defaults for this node, with the parent defaults we might
        // have from a previous run: defaults[key].
        acc[key] = computeDefaults(
          schema.properties[key],
          (defaults || {})[key],
          definitions
        );
        return acc;
      }, {});

    case "array":
      if (schema.minItems) {
        if (!isMultiSelect(schema, definitions)) {
          const defaultsLength = defaults ? defaults.length : 0;
          if (schema.minItems > defaultsLength) {
            const defaultEntries = defaults || [];
            // populate the array with the defaults
            const fillerEntries = new Array(
              schema.minItems - defaultsLength
            ).fill(
              computeDefaults(schema.items, schema.items.defaults, definitions)
            );
            // then fill up the rest with either the item default or empty, up to minItems

            return defaultEntries.concat(fillerEntries);
          }
        } else {
          return [];
        }
      }
  }
  return defaults;
}

export function getDefaultFormState(_schema, formData, definitions = {}) {
  if (!isObject(_schema)) {
    throw new Error("Invalid schema: " + _schema);
  }
  const schema = retrieveSchema(_schema, definitions);
  const defaults = computeDefaults(schema, _schema.default, definitions);
  if (typeof formData === "undefined") {
    // No form data? Use schema defaults.
    return defaults;
  }
  if (isObject(formData)) {
    // Override schema defaults with form data.
    return mergeObjects(defaults, formData);
  }
  return formData || defaults;
}

export function orderProperties(properties, order) {
  if (!Array.isArray(order)) {
    return properties;
  }

  const arrayToHash = arr =>
    arr.reduce((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {});
  const errorPropList = arr =>
    arr.length > 1
      ? `properties '${arr.join("', '")}'`
      : `property '${arr[0]}'`;
  const propertyHash = arrayToHash(properties);
  const orderHash = arrayToHash(order);
  const extraneous = order.filter(prop => prop !== "*" && !propertyHash[prop]);
  if (extraneous.length) {
    throw new Error(
      `uiSchema order list contains extraneous ${errorPropList(extraneous)}`
    );
  }
  const rest = properties.filter(prop => !orderHash[prop]);
  const restIndex = order.indexOf("*");
  if (restIndex === -1) {
    if (rest.length) {
      throw new Error(
        `uiSchema order list does not contain ${errorPropList(rest)}`
      );
    }
    return order;
  }
  if (restIndex !== order.lastIndexOf("*")) {
    throw new Error("uiSchema order list contains more than one wildcard item");
  }

  const complete = [...order];
  complete.splice(restIndex, 1, ...rest);
  return complete;
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

export function mergeObjects(obj1, obj2, concatArrays = false) {
  // Recursively merge deeply nested objects.
  var acc = Object.assign({}, obj1); // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1[key],
      right = obj2[key];
    if (obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays);
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right);
    } else {
      acc[key] = right;
    }
    return acc;
  }, acc);
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

/**
 * This function checks if the given schema matches a single
 * constant value.
 */
export function isConstant(schema) {
  return (
    (Array.isArray(schema.enum) && schema.enum.length === 1) ||
    schema.hasOwnProperty("const")
  );
}

export function toConstant(schema) {
  if (Array.isArray(schema.enum) && schema.enum.length === 1) {
    return schema.enum[0];
  } else if (schema.hasOwnProperty("const")) {
    return schema.const;
  } else {
    throw new Error("schema cannot be inferred as a constant");
  }
}

export function isSelect(_schema, definitions = {}) {
  const schema = retrieveSchema(_schema, definitions);
  const altSchemas = schema.oneOf || schema.anyOf;
  if (Array.isArray(schema.enum)) {
    return true;
  } else if (Array.isArray(altSchemas)) {
    return altSchemas.every(altSchemas => isConstant(altSchemas));
  }
  return false;
}

export function isMultiSelect(schema, definitions = {}) {
  if (!schema.uniqueItems || !schema.items) {
    return false;
  }
  return isSelect(schema.items, definitions);
}

export function isFilesArray(schema, uiSchema, definitions = {}) {
  if (uiSchema["ui:widget"] === "files") {
    return true;
  } else if (schema.items) {
    const itemsSchema = retrieveSchema(schema.items, definitions);
    return itemsSchema.type === "string" && itemsSchema.format === "data-url";
  }
  return false;
}

export function isFixedItems(schema) {
  return (
    Array.isArray(schema.items) &&
    schema.items.length > 0 &&
    schema.items.every(item => isObject(item))
  );
}

export function allowAdditionalItems(schema) {
  if (schema.additionalItems === true) {
    console.warn("additionalItems=true is currently not supported");
  }
  return isObject(schema.additionalItems);
}
