import { type PropType, SlotsType, defineComponent } from 'vue';

export const Header1 = defineComponent({
  name: 'Header1',
  props: {
    title: {
      type: String as PropType<'a' | 'b'>,
      required: true,
    },
  },
  emits: {
    click: (id: number) => true,
  },
  setup(props) {
    return () => <div>{props.title}</div>;
  },
});
