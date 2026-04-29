package log;

import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;

import java.io.IOException;

public class My_Reducer extends Reducer<Text, IntWritable, Text, IntWritable> {

    private Text maxIP = new Text();
    private int maxCount = 0;

    public void reduce(Text key, Iterable<IntWritable> values, Context context)
            throws IOException, InterruptedException {

        int sum = 0;

        for (IntWritable value : values) {
            sum += value.get();
        }

        if (sum > maxCount) {
            maxCount = sum;
            maxIP.set(key);
        }
    }

    protected void cleanup(Context context)
            throws IOException, InterruptedException {

        context.write(maxIP, new IntWritable(maxCount));
    }
}
