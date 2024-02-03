import { DietTags, Dish } from "@/convex/dishes";
import { getAutoTags } from "@/utils/autotag";
import { Add, Close, Save } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Chip,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@mui/joy";
import { WithoutSystemFields } from "convex/server";
import { useEffect, useRef, useState } from "react";

export interface DishEditorProps {
  dish: Partial<Dish>;
  onSave: (dish: Omit<WithoutSystemFields<Dish>, "mealId">) => void;
  isNew?: boolean;
}

/**
 * Component for editing or creating dishes. The parent component controls what
 * happens with the edited dish fields through the `onSave` callback.
 *
 * Pressing the `Enter` key with the name field focused will save the late.
 */
const DishEditor = ({ dish, onSave, isNew = false }: DishEditorProps) => {
  const [name, setName] = useState(dish.name ?? "");
  const [description, setDescription] = useState(dish.description ?? "");
  const [tags, setTags] = useState<string[]>(dish.tags ?? []);
  // initially exclude tags that are not in the given dish's tags
  const [excludedAutoTags, setExcludedAutoTags] = useState<Set<string>>(
    new Set(
      getAutoTags(dish.name ?? "").filter((tag) => !dish.tags?.includes(tag))
    )
  );
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // update tags with automatic tags except for any previously excluded tags
    setTags((prevTags) =>
      Array.from(
        new Set([
          ...prevTags,
          ...getAutoTags(name).filter((tag) => !excludedAutoTags.has(tag)),
        ])
      )
    );
  }, [excludedAutoTags, name]);

  const handleSave = () => {
    if (name !== "") {
      onSave({ name, tags, description });
      setName("");
      setDescription("");
      setTags([]);
      editorRef.current?.scrollIntoView();
    }
  };

  return (
    <Stack gap={1} width="100%" ref={editorRef}>
      <FormControl>
        {isNew && <FormLabel>Add a new dish</FormLabel>}
        <Stack direction="row" gap={1}>
          <Input
            fullWidth
            size="md"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                handleSave();
              }
            }}
            placeholder="name of your dish"
          />
          <Button
            startDecorator={isNew ? <Add /> : <Save />}
            onClick={handleSave}
          >
            {isNew ? "Add" : "Save"}
          </Button>
        </Stack>
      </FormControl>
      <FormControl>
        <FormLabel>Tags</FormLabel>
        <Autocomplete
          options={[...Object.values(DietTags)]}
          value={tags}
          multiple
          freeSolo
          sx={{ flex: 1 }}
          variant="soft"
          onChange={(_event, newValue, changeReason, changeDetails) => {
            if (changeReason === "removeOption" && changeDetails) {
              // prevent re-adding the same auto tag
              setExcludedAutoTags(
                new Set([...Array.from(excludedAutoTags), changeDetails.option])
              );
            }
            return setTags(newValue);
          }}
          renderTags={(tags, getTagProps) =>
            tags.map((item, index) => (
              <Chip
                variant="outlined"
                endDecorator={<Close fontSize="inherit" />}
                {...getTagProps({ index })}
                key={index}
              >
                {item}
              </Chip>
            ))
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>Description (optional)</FormLabel>
        <Textarea
          size="md"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="special notes, ingredients, allergens, etc."
          variant="soft"
        />
      </FormControl>
    </Stack>
  );
};

export default DishEditor;
