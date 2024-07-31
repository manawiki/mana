## Import File Formatting Cheat Sheet

Last update: 10/30/2023

All files should be in .JSON format for importing.
Generally, for number, text, textarea, checkbox, json fields that only have one value, these just need to have the field name as the object key, and the value as the value to be imported, such as:

```
{
	data_key: value,
}
```

Special cases are listed below for specific types of fields.

### Relationship Fields (Single)

Use the below format for relationship fields that are one-one relations (hasMany = false).

```
"FIELD_NAME": {
	"TARGET_COLLECTION_IDENTIFIER_FIELD_NAME": value
}
```

Example:

```
"effect": {
	"drupal_tid": 4701
}
```

### Relationship Fields (Single + Polymporphic)

Use the below format for relationship fields that are one-one relations (hasMany = false).

```
"FIELD_NAME": {
	"TARGET_COLLECTION_IDENTIFIER_FIELD_NAME": {
		"relationTo": "TARGET_COLLECTION_SLUG",
		"value": value1
	}
}
```

Example:

```
"mat": {
	"drupal_nid": {
		"relationTo": "materials",
		"value": 5671
	}
}
```

! For 2nd level nested and above, do not include TARGET_COLLECTION_DENTIFIER_FIELD_NAME; Note in this case the value must be the ID:

```
"FIELD_NAME": {
		"relationTo": "TARGET_COLLECTION_SLUG",
		"value": value1
}
```

Example:

```
"mat": {
		"relationTo": "materials",
		"value": 5671
}
```

### Relationship Fields (Multiple)

Use the below format for relationship fields that are many-one relations (hasMany = true).

```
"FIELD_NAME": {
	"TARGET_COLLECTION_IDENTIFIER_FIELD_NAME": [
		value1,
		value2,
		value3,
		...
	]
}
```

Example:

```
"bonus_item": {
	"drupal_nid": [
		1024711,
		1024706,
		1024701
	]
}
```

### Relationship Fields (Multiple + Polymorphic)

Use the below format for relationship fields that are many-one relations (hasMany = true) that are also _polymporphic_ (relationTo: [ARRAY of collections]).

```
"FIELD_NAME": {
	"TARGET_COLLECTION_IDENTIFIER_FIELD_NAME": [
		{
			"relationTo": "TARGET_COLLECTION_SLUG",
			"value": value1
		},
		{
			"relationTo": "TARGET_COLLECTION_SLUG",
			"value": value2
		}
	]
}
```

Example:

```
"effect_condition": {
	"drupal_tid": [
		{
			"relationTo": "_status-effects",
			"value": 6221
		},
		{
			"relationTo": "_enemy-traits",
			"value": 1336
		}
	]
}
```
