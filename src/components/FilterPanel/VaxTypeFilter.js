/* render like:
            <Grid item xs={12}>
                <VaxTypeFilter
                    vaxTypeFilter={vaxTypeFilter}
                    onChange={setVaxTypeFilter}
                />
            </Grid>
*/

//filter logic:

/*
            vaxType: (d) => {
                if (d.extraData && d.extraData["Vaccinations offered"]) {
                    const vaxes = d.extraData["Vaccinations offered"];
                    for (let i = 0; i < vaxTypeFilter.types.length; i++) {
                        if (
                            vaxTypeFilter.include[i] &&
                            vaxes.includes(vaxTypeFilter.types[i])
                        ) {
                            return true;
                        }
                    }

                    return false;
                } else {
                    return vaxTypeFilter.include[vaxTypeFilter.include.length];
                }
            },
*/

//effects and state:

/*
    const [vaxTypeFilter, setVaxTypeFilter] = useState({
        types: [],
        include: [],
    });

    useEffect(() => {
        const vaxTypes = Array.from(
            new Set(
                data.reduce((acc, cur) => {
                    if (
                        cur.extraData &&
                        cur.extraData["Vaccinations offered"]
                    ) {
                        acc = acc.concat(
                            cur.extraData["Vaccinations offered"]
                                .split(",")
                                .map((d) => d.trim())
                        );
                    }
                    return acc;
                }, [])
            )
        );

        vaxTypes.push("Not Specified");

        setVaxTypeFilter({
            types: vaxTypes,
            include: Array.apply(null, Array(vaxTypes.length)).map((d) => true),
        });
    }, [data]);
*/

//component:
/*

function VaxTypeFilter(props) {
    const classes = useStyles();

    const handleChange = (e) => {
        const changedIndex = props.vaxTypeFilter.types.indexOf(e.target.name);
        const newFilters = [...props.vaxTypeFilter.include];
        newFilters[changedIndex] = e.target.checked;

        props.onChange({
            types: props.vaxTypeFilter.types,
            include: newFilters,
        });
    };

    return (
        <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Vaccine Type</FormLabel>
            <FormGroup>
                {props.vaxTypeFilter.types.map((vaxType, i) => {
                    return (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={props.vaxTypeFilter.include[i]}
                                    onChange={handleChange}
                                    name={vaxType}
                                />
                            }
                            label={vaxType}
                            key={vaxType}
                        />
                    );
                })}
            </FormGroup>
        </FormControl>
    );
}
*/
